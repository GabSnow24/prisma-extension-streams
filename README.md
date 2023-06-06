# NPM Module for Streams in Prisma ORM 

Prisma Streams is a typescript first module that will transform SQL data from queries in streams, in order to improve performance in larger datasets. This module will be configured as a [Prisma ORM](https://www.prisma.io) [client extension](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions/shared-extensions) that will return [Node Streams](https://nodejs.org/api/stream.html) from Prisma queries.


It's recomendable to take a look on Prisma install and configuration before using this module.

## Quick start

To use extension:

1. Create your prisma client in project (if doesnt exists) using:
    ```
    npx prisma generate
    ```
1. Install Prisma Streams.
    ```
    npm install prisma-extension-streams
    ```
1. Dont forget to enable extension on your client generator on schema.prisma.
    ```
    generator client {
    provider        = "prisma-client-js"
    previewFeatures = ["clientExtensions"] //TURN-ON
    }
    ```

1. Import Prisma Streams module inside your project
    ```
    import { PrismaStreams } from 'prisma-extension-streams';
    //OR
    import * as PrismaStreams from 'prisma-extension-streams';
    ```
1. Set $extends configuration and create a new [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client), example:
    ```
    import { PrismaStreams } from 'prisma-extension-streams';

    const prismaClient = new PrismaClient()
    const xprisma = prismaClient.$extends(PrismaStreams)
    //OR
    const prismaClient = new PrismaClient().$extends(PrismaStreams)
    ```

1. Usage example:
    ```
    import { PrismaStreams } from 'prisma-extension-streams';

    const prismaClient = new PrismaClient().$extends(PrismaStreams)

    async findAll() {
    //TS Ignore is necessary because this is a beta feature on Prisma and type-safety is being improved.
    //@ts-ignore
    const stream = prismaClient.product.findManyStream()
    for await (const entity of stream) {
      console.log(entity.id)
    }
    }
    ```

## GitHub

If you liked this project, dont hesitate to star that project on our [GitHub](https://github.com/GabSnow24/prisma-extension-streams). Happy Code c:

