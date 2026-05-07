import { Body,Controller,Get,HttpCode, HttpStatus,  Post,Request,UseGuards} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';


@ApiTags('Auth') // ตั้งชื่อหมวดหมู่ของ API
@ApiBearerAuth()  // ✅ ใช้ Bearer Token สำหรับป้องกัน API นี้
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


}
