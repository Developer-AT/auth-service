import { SetMetadata } from '@nestjs/common';

export const AccessBy = (...accessBy: string[]) =>
    SetMetadata('accessBy', accessBy);
