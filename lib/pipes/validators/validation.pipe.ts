import type { ClassTransformOptions } from 'class-transformer';
import type { ValidatorOptions } from 'class-validator';
import { loadPackage } from '../../internals/loadPackage';
import { validateObject } from '../../internals/validateObject';
import type { ParameterPipe, PipeMetadata } from '../ParameterPipe';

export interface ValidationPipeOptions extends ValidatorOptions {
  /** Options for the `class-transformer` package. */
  transformOptions?: ClassTransformOptions;
}

/**
 * Validates request body values and gets them as DTOs.
 *
 * @remarks
 * `class-validator` and `class-transformer` need to be installed.
 * More information: [data transfer object](https://github.com/storyofams/next-api-decorators#data-transfer-object)
 */
export function ValidationPipe(options?: ValidationPipeOptions): ParameterPipe<any> {
  if (process.env.NODE_ENV === 'development') {
    ['class-validator', 'class-transformer'].forEach(requiredPackage =>
      loadPackage(requiredPackage, {
        context: 'ValidationPipe',
        docsUrl: 'https://github.com/storyofams/next-api-decorators#data-transfer-object'
      })
    );
  }

  return (value: any, metadata?: PipeMetadata) => {
    if (!metadata?.metaType) {
      return value;
    }

    return validateObject(metadata?.metaType, value, options);
  };
}
