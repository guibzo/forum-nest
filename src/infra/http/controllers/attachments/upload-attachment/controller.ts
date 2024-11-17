import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { uploadAttachmentResponseSchema } from './schemas'

@ApiTags('Attachments')
@Controller('/attachments')
export class UploadAttachmentController {
  // constructor(private uploadAttachmentUseCase: UploadAttachmentUseCase) {}

  @Post()
  @ApiResponse({
    schema: zodToOpenAPI(uploadAttachmentResponseSchema),
    description: 'Upload a attachment',
  })
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    console.log(file)
  }
}
