/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';

import {
  APP_ID as CASES_APP_ID,
  constructFileKindIdByOwner,
} from '@kbn/cases-plugin/common/constants';
import { APP_ID as SECURITY_SOLUTION_APP_ID } from '@kbn/security-solution-plugin/common/constants';
import { observabilityFeatureId as OBSERVABILITY_APP_ID } from '@kbn/observability-plugin/common';
import { BaseFilesClient } from '@kbn/shared-ux-file-types';
import { User } from '../../../cases_api_integration/common/lib/authentication/types';
import {
  createFile,
  deleteFiles,
  uploadFile,
  downloadFile,
  createAndUploadFile,
  listFiles,
  getFileById,
  deleteAllFiles,
} from '../../../cases_api_integration/common/lib/api';
import { FtrProviderContext } from '../../ftr_provider_context';
import {
  casesAllUser,
  casesNoDeleteUser,
  casesReadUser,
  obsCasesAllUser,
  obsCasesNoDeleteUser,
  obsCasesReadUser,
  secAllCasesNoDeleteUser,
  secAllUser,
  secReadCasesReadUser,
} from './common/users';

interface TestScenario {
  user: User;
  fileKind: string;
}

const SECURITY_SOLUTION_FILE_KIND = constructFileKindIdByOwner(SECURITY_SOLUTION_APP_ID);
const OBSERVABILITY_FILE_KIND = constructFileKindIdByOwner(OBSERVABILITY_APP_ID);
const CASES_FILE_KIND = constructFileKindIdByOwner(CASES_APP_ID);

export default ({ getService }: FtrProviderContext): void => {
  const supertestWithoutAuth = getService('supertestWithoutAuth');
  const supertest = getService('supertest');

  describe('files', () => {
    describe('failure requests', () => {
      const createFileFailure = async (scenario: TestScenario) => {
        await createFile({
          supertest: supertestWithoutAuth,
          auth: { user: scenario.user, space: null },
          params: {
            kind: scenario.fileKind,
            name: 'testFile',
            mimeType: 'image/png',
          },
          expectedHttpCode: 403,
        });
      };

      const deleteFileFailure = async (scenario: TestScenario) => {
        await deleteFiles({
          supertest: supertestWithoutAuth,
          auth: { user: scenario.user, space: null },
          files: [{ kind: scenario.fileKind, id: 'abc' }],
          expectedHttpCode: 403,
        });
      };

      const uploadFileFailure = async (scenario: TestScenario) => {
        await uploadFile({
          supertest: supertestWithoutAuth,
          auth: { user: scenario.user, space: null },
          data: 'abc',
          kind: scenario.fileKind,
          mimeType: 'image/png',
          fileId: '123',
          expectedHttpCode: 403,
        });
      };

      const listFilesFailure = async (scenario: TestScenario) => {
        await listFiles({
          supertest: supertestWithoutAuth,
          auth: { user: scenario.user, space: null },
          params: {
            kind: scenario.fileKind,
          },
          expectedHttpCode: 403,
        });
      };

      const downloadFileFailure = async (scenario: TestScenario) => {
        await downloadFile({
          supertest: supertestWithoutAuth,
          auth: { user: scenario.user, space: null },
          fileId: 'abc',
          fileName: '123',
          mimeType: 'image/png',
          kind: scenario.fileKind,
          expectedHttpCode: 401,
        });
      };

      const getFileByIdFailure = async (scenario: TestScenario) => {
        await getFileById({
          supertest: supertestWithoutAuth,
          auth: { user: scenario.user, space: null },
          id: 'abc',
          kind: scenario.fileKind,
          expectedHttpCode: 403,
        });
      };

      describe('user not authorized for a delete operation', () => {
        const testScenarios: TestScenario[] = [
          { user: secAllCasesNoDeleteUser, fileKind: SECURITY_SOLUTION_FILE_KIND },
          { user: casesNoDeleteUser, fileKind: CASES_FILE_KIND },
          { user: obsCasesNoDeleteUser, fileKind: OBSERVABILITY_FILE_KIND },
        ];

        for (const scenario of testScenarios) {
          it('should fail to delete a file', async () => {
            await deleteFileFailure(scenario);
          });
        }
      });

      describe('user not authorized for write operations', () => {
        const testScenarios: TestScenario[] = [
          { user: secReadCasesReadUser, fileKind: SECURITY_SOLUTION_FILE_KIND },
          { user: casesReadUser, fileKind: CASES_FILE_KIND },
          { user: obsCasesReadUser, fileKind: OBSERVABILITY_FILE_KIND },
        ];

        for (const scenario of testScenarios) {
          it('should fail to create a file', async () => {
            await createFileFailure(scenario);
          });

          it('should fail to upload a file', async () => {
            await uploadFileFailure(scenario);
          });

          it('should fail to delete a file', async () => {
            await deleteFileFailure(scenario);
          });
        }
      });

      describe('user not authorized for file kind', () => {
        const testScenarios: TestScenario[] = [
          { user: secAllUser, fileKind: CASES_FILE_KIND },
          {
            user: casesAllUser,
            fileKind: SECURITY_SOLUTION_FILE_KIND,
          },
          {
            user: obsCasesAllUser,
            fileKind: CASES_FILE_KIND,
          },
        ];

        for (const scenario of testScenarios) {
          describe(`scenario user: ${scenario.user.username} fileKind: ${scenario.fileKind}`, () => {
            it('should fail to create a file', async () => {
              await createFileFailure(scenario);
            });

            it('should fail to upload a file', async () => {
              await uploadFileFailure(scenario);
            });

            it('should fail to delete a file', async () => {
              await deleteFileFailure(scenario);
            });

            it('should fail to list files', async () => {
              await listFilesFailure(scenario);
            });

            it('should fail to download a file', async () => {
              await downloadFileFailure(scenario);
            });

            it('should fail to get a file by its id', async () => {
              await getFileByIdFailure(scenario);
            });
          });
        }
      });
    });

    describe('successful requests', () => {
      describe('users with read privileges', () => {
        const testScenarios: TestScenario[] = [
          { user: secReadCasesReadUser, fileKind: SECURITY_SOLUTION_FILE_KIND },
          { user: casesReadUser, fileKind: CASES_FILE_KIND },
          { user: obsCasesReadUser, fileKind: OBSERVABILITY_FILE_KIND },
        ];

        for (const scenario of testScenarios) {
          describe(`scenario user: ${scenario.user.username} fileKind: ${scenario.fileKind}`, () => {
            let createdFile: Awaited<ReturnType<BaseFilesClient['create']>>;

            beforeEach(async () => {
              const { create } = await createAndUploadFile({
                supertest,
                data: 'abc',
                createFileParams: {
                  name: 'testFile',
                  mimeType: 'image/png',
                  kind: scenario.fileKind,
                },
              });
              createdFile = create;
            });

            afterEach(async () => {
              await deleteAllFiles({
                supertest,
                kind: scenario.fileKind,
              });
            });

            it('should list files', async () => {
              const files = await listFiles({
                supertest: supertestWithoutAuth,
                params: { kind: scenario.fileKind },
                auth: { user: scenario.user, space: null },
              });

              expect(files.total).to.be(1);
              expect(files.files[0].name).to.be(createdFile.file.name);
            });

            it('should get a file by its id', async () => {
              const file = await getFileById({
                supertest: supertestWithoutAuth,
                id: createdFile.file.id,
                kind: scenario.fileKind,
                auth: { user: scenario.user, space: null },
              });

              expect(file.file.name).to.be(createdFile.file.name);
            });
          });
        }
      });

      describe('users with all privileges', () => {
        const testScenarios: TestScenario[] = [
          { user: secAllUser, fileKind: SECURITY_SOLUTION_FILE_KIND },
          { user: casesAllUser, fileKind: CASES_FILE_KIND },
          { user: obsCasesAllUser, fileKind: OBSERVABILITY_FILE_KIND },
        ];

        for (const scenario of testScenarios) {
          describe(`scenario user: ${scenario.user.username} fileKind: ${scenario.fileKind}`, () => {
            it('should create and delete a file', async () => {
              const createResult = await createFile({
                supertest: supertestWithoutAuth,
                auth: { user: scenario.user, space: null },
                params: {
                  kind: scenario.fileKind,
                  name: 'testFile',
                  mimeType: 'image/png',
                },
              });

              await deleteFiles({
                supertest: supertestWithoutAuth,
                auth: { user: scenario.user, space: null },
                files: [{ kind: scenario.fileKind, id: createResult.file.id }],
              });
            });

            describe('delete created file after test', () => {
              afterEach(async () => {
                await deleteAllFiles({
                  supertest,
                  kind: scenario.fileKind,
                });
              });

              it('should list files', async () => {
                const { create } = await createAndUploadFile({
                  supertest: supertestWithoutAuth,
                  data: 'abc',
                  createFileParams: {
                    name: 'testFile',
                    mimeType: 'image/png',
                    kind: scenario.fileKind,
                  },
                  auth: { user: scenario.user, space: null },
                });

                const files = await listFiles({
                  supertest: supertestWithoutAuth,
                  params: { kind: scenario.fileKind },
                  auth: { user: scenario.user, space: null },
                });

                expect(files.total).to.be(1);
                expect(files.files[0].name).to.be(create.file.name);
              });

              it('should download a file', async () => {
                const { create } = await createAndUploadFile({
                  supertest: supertestWithoutAuth,
                  data: 'abc',
                  createFileParams: {
                    name: 'testFile',
                    mimeType: 'image/png',
                    kind: scenario.fileKind,
                  },
                  auth: { user: scenario.user, space: null },
                });

                const { body: buffer, header } = await downloadFile({
                  supertest,
                  auth: { user: scenario.user, space: null },
                  fileId: create.file.id,
                  kind: scenario.fileKind,
                  mimeType: 'image/png',
                  fileName: 'test.png',
                });

                expect(header['content-type']).to.eql('image/png');
                expect(header['content-disposition']).to.eql('attachment; filename="test.png"');
                expect(buffer.toString('utf8')).to.eql('abc');
              });

              it('should upload a file', async () => {
                const createResult = await createFile({
                  supertest: supertestWithoutAuth,
                  auth: { user: scenario.user, space: null },
                  params: {
                    kind: scenario.fileKind,
                    name: 'testFile',
                    mimeType: 'image/png',
                  },
                });

                const uploadResult = await uploadFile({
                  supertest: supertestWithoutAuth,
                  auth: { user: scenario.user, space: null },
                  data: 'abc',
                  kind: scenario.fileKind,
                  mimeType: 'image/png',
                  fileId: createResult.file.id,
                });

                expect(uploadResult.ok).to.be(true);
                expect(uploadResult.size).to.be(3);
              });
            });
          });
        }
      });
    });
  });
};
