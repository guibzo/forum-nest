import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
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
  constructor(private uploadAndCreateAttachmentUseCase: UploadAndCreateAttachmentUseCase) {}

  @Post()
  @ApiResponse({
    schema: zodToOpenAPI(uploadAttachmentResponseSchema),
    description: 'Upload a attachment',
    status: 201,
  })
  @HttpCode(201)
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
    const result = await this.uploadAndCreateAttachmentUseCase.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }

    const { attachment } = result.value

    return {
      attachmentId: attachment.id.toString(),
    }
  }
}
