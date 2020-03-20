import {
	UseGuards,
	Controller,
	Request,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	Query,
} from '@nestjs/common';
import {
	ApiUseTags,
	ApiOkResponse,
	ApiForbiddenResponse,
	ApiOperation,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { OAuthDTO } from 'src/module/notice/notice.dto';
import { NoticeService } from 'src/module/notice/notice.service';
import { PhoneUtil } from 'src/utils/phone.util';
@ApiUseTags('api/notice')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/notices')
export class ApiNoticeController {
	constructor(
		private noticeService: NoticeService,
		private phoneUtil: PhoneUtil,
	) {}

	@Post('/oauth')
	@ApiOperation({ title: '微信授权', description: '微信授权' })
	async OAuth(@Body() oauth: OAuthDTO) {
		await this.noticeService.oauth(oauth);
		return 'success';
	}

	@Get('/code')
	@ApiOperation({ title: '短信验证码', description: '短信验证码' })
	async code(@Query('phone') phone: string) {
		await this.phoneUtil.sendVerificationCode(phone);
		return 'success';
	}
}
