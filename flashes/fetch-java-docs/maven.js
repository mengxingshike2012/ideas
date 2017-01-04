module.exports = {
	services: [
		{
			appName: 'shop',
			api: {

			},
			dependency: {
			  groupId: 'com.dianwoba.mall',
			  artifactId: 'mall-service-api',
			  version: '1.0.0-SNAPSHOT'
		    }
		},
		{
			appName: 'batman',
			api: {

			},
			dependency: {
				groupId: 'org.webjars',
				artifactId: 'batmanjs',
				version: '0.15.0'
			}
		}
	]
}