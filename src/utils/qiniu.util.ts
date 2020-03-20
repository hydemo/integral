import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';
import { RedisService } from 'nestjs-redis';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class QiniuUtil {
	constructor(
		private readonly config: ConfigService,
		private readonly redis: RedisService,
	) {}

	/**
	 * 刷新七牛云token
	 *
	 */
	async refreshUpToken(): Promise<string> {
		const mac = new qiniu.auth.digest.Mac(
			this.config.qiniuAccessKey,
			this.config.qiniuSecretKey,
		);
		const options = {
			scope: this.config.qiniuBucket,
			expires: 7200,
		};
		const putPolicy = new qiniu.rs.PutPolicy(options);
		const uploadToken = putPolicy.uploadToken(mac);
		const client = this.redis.getClient();
		await client.set('qiniu_upToken', uploadToken, 'EX', 60 * 60 * 1.5);
		return uploadToken;
	}
	/**
	 * 获取七牛云token
	 *
	 */
	async getUpToken(): Promise<string> {
		const client = this.redis.getClient();
		const token = await client.get('qiniu_upToken');
		if (!token) {
			return this.refreshUpToken();
		}
		return token;
	}

	/**
	 * 刷新七牛云下载token
	 *
	 */
	async refreshDownToken(): Promise<string> {
		const mac = new qiniu.auth.digest.Mac(
			this.config.qiniuAccessKey,
			this.config.qiniuSecretKey,
		);
		const options = {
			scope: this.config.qiniuBucket,
			expires: 7200,
		};
		const putPolicy = new qiniu.rs.PutPolicy(options);
		const uploadToken = putPolicy.uploadToken(mac);
		const client = this.redis.getClient();
		await client.set('qiniu_upToken', uploadToken, 'EX', 60 * 60 * 1.5);
		return uploadToken;
	}
}
