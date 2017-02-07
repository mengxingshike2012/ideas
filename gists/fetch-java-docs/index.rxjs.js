"use strict";
// Let's see can you use RxJs to rewrite this.
const Rx = require('rxjs');
const fs = require("fs");
const http = require("http");
const path = require("path");
const fetch = require('isomorphic-fetch');
const mkdir = require('mkdirp')


// 获取配置文件
const sonatypeConfig = require('./sonatype.config');
const { host, servicePath } = sonatypeConfig;
const mavenConfig = require('./maven');
// 默认获取的文件类型: javadoc
const CLASSIFIER = 'javadoc';

const tasks = mavenConfig.services.map(s => s.dependency)

const dirName = mavenConfig.jarDownloadLocation || './sonatype/jars';
const dirExists = fs.existsSync(dirName)
if (!dirExists) {
	mkdir.sync(dirName)
	console.log(`✅  make dir: ${dirName} succeed!`);
}

const StepOneSearchUrlPrefix = `${host}${servicePath}/lucene/search?q=`;
const StewTwoDetailUrlPrefix = `${host}${servicePath}/artifact/maven/resolve?_dc=1`;
const StepThreeJarUrlPrefix = `${host}${servicePath}/repositories`;

const result = Rx.Observable.from(tasks)
	.mergeMap(t => {
		const searchUrl = `${StepOneSearchUrlPrefix}${t.artifactId}&collapseresults=true`;
		return Rx.Observable.fromPromise(fetch(searchUrl, {
					headers: {
						'Accept': 'application/json'
					}
				})
				.then(resp => resp.json()))
				.map(result => {
					if (!result.totalCount) {
						console.log(`❌  Can not find any resource for ${t.artifactId}`)
						return false
					}
					const matchedArtifacts = result.data.filter(i => i.artifactId === t.artifactId)
					if (!matchedArtifacts.length) {
						console.log(`❌  Cant not find resource for ${t.artifactId} with exact match`)
					}
					// validate version
					const matchedVersions = matchedArtifacts.filter(i => i.version === t.version);
					if (!matchedVersions.length) {
						console.log(`❌  Cant not find resource for ${t.artifactId} of version ${t.version}`)
					}
					// validate groupId
					const target = matchedVersions[0];
					if (target.groupId !== t.groupId) {
						console.log(`❌  GroupId is not matched, ${t.groupId} is wanted, but found ${target.groupId}`);
					}
					// find type e.g javadoc nouse classifier
					const artifactHits = target.artifactHits;
					let firstMatched;
					let repositoryId;
					for (let i = 0; i < artifactHits.length; i++) {
						const links = artifactHits[i].artifactLinks;
						const docLink = links.find(l => l.classifier === CLASSIFIER);
						if (docLink) {
							firstMatched = true;
							repositoryId = artifactHits[i].repositoryId
							break;
						}
					}
					if (!firstMatched) {
						console.log(`❌  No ${CLASSIFIER} found for ${t.artifactId}-${t.version}`);
					}
					return {
						t,
						repositoryId,
					}
				})
	})
	.filter(r => r)
	.mergeMap(r => {
			const {t, repositoryId} = r;
			const detailUrl = `${StewTwoDetailUrlPrefix}&r=${repositoryId}&g=${t.groupId}&a=${t.artifactId}&v=${t.version}&c=javadoc&e=jar&isLocal=true`
			return Rx.Observable.fromPromise(fetch(detailUrl, {
				headers: {
						'Accept': 'application/json'
					}
			})
			.then(resp => resp.json()))
			.map(result => {
				const repositoryPath = result.data.repositoryPath;
				if (!repositoryPath) {
					console.log(`❌  failed to get repositoryPath of ${t.artifactId}-${t.version}`)
					return false;
				}
				const jarUrl = `${StepThreeJarUrlPrefix}/${repositoryId}/content${repositoryPath}`
				// console.log(jarUrl);
				// const infoUrl = `${jarUrl}?describe=info&isLocal=true`
				// const infoDetail = await fetch(infoUrl, {
				// 	headers: {
				// 	'Accept': 'application/json'
				//     }
				// })
				// .then(resp => resp.json());
				// if (!infoDetail.data.presentLocally) {
				// 	console.log(`❌  ${t.artifactId}-${t.version} has NOT been Cached Locally can not been downloaded!`)
				// 	return false;
				// } else {
				// 	return jarUrl;
				// }
				return {t, jarUrl}
			})
	})
	.mergeMap(r => {
		return Rx.Observable.fromPromise(getPromisedHttpRequest(r.jarUrl, r.t))
	})
	.do(r => console.log(r));

result.subscribe();



const getPromisedHttpRequest = (jarUrl, t) => {

	return new Promise((resolve, reject) => {
		const fileName = path.basename(jarUrl);
		const req = http.request(jarUrl, (res) => {
			let fileBuff = [];
			res.on('data', (chunk) => {
				const buffer = new Buffer(chunk)
				fileBuff.push(buffer);
			});
			res.on('end', () => {
				const totalBuff = Buffer.concat(fileBuff);
				fs.writeFile(`${dirName}/${fileName}`, totalBuff, (e) => { 
					if (e) {
						console.log(`❌  error while writing ${CLASSIFIER} of ${t.artifactId}-${t.version}`, e)
						reject(e)
					} else {
						console.log(`✅  ${t.artifactId}-${t.version} has been downloaded successfully!`)
						resolve(true)
					}
				})
			})
		});
		req.on('error', (e) => {
			console.log(`❌  error happened while downloading ${t.artifactId}-${t.version}`, e);
			reject(e)
		})
        req.end();
	});
}


