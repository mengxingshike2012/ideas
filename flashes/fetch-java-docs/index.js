"use strict";
const fs = require("fs");
const http = require("http");
const path = require("path");
const fetch = require('isomorphic-fetch')
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

tasks.forEach(t => findJavaDocAddrAndDownload(t));

function findJavaDocAddrAndDownload(task) {
	const searchUrl = `${StepOneSearchUrlPrefix}${task.artifactId}&collapseresults=true`;
	// console.log(searchUrl)
	fetch(searchUrl, {
		headers: {
			'Accept': 'application/json'
		}
	})
	.then(resp => resp.json())
	.then(result => {
		// valiate artifactId
		if (!result.totalCount) {
			console.log(`❌  Can not find any resource for ${task.artifactId}`)
			return
		}
		const matchedArtifacts = result.data.filter(i => i.artifactId === task.artifactId)
		if (!matchedArtifacts.length) {
			console.log(`❌  Cant not find resource for ${task.artifactId} with exact match`)
			return;
		}
		// validate version
		const matchedVersions = matchedArtifacts.filter(i => i.version === task.version);
		if (!matchedVersions.length) {
			console.log(`❌  Cant not find resource for ${task.artifactId} of version ${task.version}`)
			return;
		}
		// validate groupId
		const target = matchedVersions[0];
		if (target.groupId !== task.groupId) {
			console.log(`❌  GroupId is not matched, ${task.groupId} is wanted, but found ${target.groupId}`);
			return;
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
			console.log(`❌  No ${CLASSIFIER} found for ${task.artifactId}-${task.version}`);
			return;
		}
		fetchDownLoadUrl(task, repositoryId)

	})
	.catch(err => console.log(err))
}

function fetchDownLoadUrl(t, repositoryId) {
	const detailUrl = `${StewTwoDetailUrlPrefix}&r=${repositoryId}&g=${t.groupId}&a=${t.artifactId}&v=${t.version}&c=javadoc&e=jar&isLocal=true`
	// console.log(detailUrl)
	fetch(detailUrl, {
		headers: {
			'Accept': 'application/json'
		}
	})
	.then(resp => resp.json())
	.then(result => {
		// console.log(result)
		const repositoryPath = result.data.repositoryPath;
		if (!repositoryPath) {
			console.log(`❌  failed to get repositoryPath of ${t.artifactId}-${t.version}`)
			return;
		}
		const jarUrl = `${StepThreeJarUrlPrefix}/${repositoryId}/content${repositoryPath}`
		// console.log(jarUrl);
		const infoUrl = `${jarUrl}?describe=info&isLocal=true`
		fetch(infoUrl, {
			headers: {
			'Accept': 'application/json'
		    }
		})
		.then(resp => resp.json())
		.then(result => {
			if (!result.data.presentLocally) {
				console.log(`❌  ${t.artifactId}-${t.version} has NOT been Cached Locally can not been downloaded!`)
				return;
			} else {
				startDownloadTask(jarUrl, t);
			}
		})
		.catch(err => console.log(err))
		
	})
	.catch(err => console.log(err))
}

function startDownloadTask(jarUrl, t) {
	const req = http.request(jarUrl, generateHttpDownloadCb(jarUrl, t));
    req.on('error', (e) => console.log(`❌  error happened while downloading ${t.artifactId}-${t.version}`, e));
    req.end();
}

function generateHttpDownloadCb(jarUrl, t) {
	const fileName = path.basename(jarUrl);
	return (res) => {
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
				} else {
					console.log(`✅  ${t.artifactId}-${t.version} has been downloaded successfully!`)
				}
			})
		})
	}
}


