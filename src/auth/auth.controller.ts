import { Body,Controller,Get,HttpCode, HttpStatus,  Post,Request,UseGuards} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';


@ApiTags('Auth') // ตั้งชื่อหมวดหมู่ของ API
@ApiBearerAuth()  // ✅ ใช้ Bearer Token สำหรับป้องกัน API นี้
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


 @Post('login')
  @ApiOperation({ summary: 'Login to get JWT access token' })
  @ApiBody({  //Request body ที่รับมาจะเป็น object ที่มี property username และ password
    description: 'Login credentials',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5c...' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signIn(@Body() body: any) {
    // console.log('Received body:', body); // Debugging
    return this.authService.signIn(body);
  }




 @Post('loginpassweb')
  @ApiOperation({ summary: 'Login to get JWT access token' })
  @ApiBody({  //Request body ที่รับมาจะเป็น object ที่มี property username และ password
    description: 'Login credentials',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin' },
        passweb: { type: 'string', example: '' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5c...' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signInpassweb(@Body() body: any) {
    // console.log('Received body:', body); // Debugging
    return this.authService.signInpassweb(body);
  }

  // ****************************************************************
 // ****************************************************************
 
  // เพิ่มเมธอดใหม่สำหรับการเรียกใช้งาน user
  @UseGuards(AuthGuard) // ใช้ guard ถ้าต้องการให้มีการตรวจสอบ token ก่อน
  @Get('profile')
  async getUser(@Request() req) {
    return this.authService.user(req);
  }
 
}
