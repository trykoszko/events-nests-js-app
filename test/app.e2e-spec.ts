import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { prepareDb } from './utils/db';

let app: INestApplication;
let mod: TestingModule;

let dataSource: DataSource;

describe('Web (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    mod = await Test
      .createTestingModule({
        imports: [
          AppModule
        ],
      })
      .compile();

    app = await mod.createNestApplication();

    await app.init();

    dataSource = await app.get(DataSource);

    await prepareDb(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(404);
  });

});
