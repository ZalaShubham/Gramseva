import { strict as assert } from 'node:assert';
import { describe, test } from 'node:test';
import { matrimonialService } from '@/modules/matrimonial/matrimonial-service';
import {
  CreatedBy,
  Gender,
  PhotoPrivacy,
  RelationStatus,
  Profile,
} from '@/modules/matrimonial/types';

// Helper to create a minimal profile object for tests
function makeProfile(overrides: Partial<Profile> = {}): Omit<Profile, 'id' | 'ownerUserId' | 'photos'> {
  return {
    createdBy: CreatedBy.Self,
    name: 'Test User',
    gender: Gender.Female,
    dateOfBirth: '2000-01-01', // age >= 18
    subCaste: 'Brahmin',
    ...overrides,
  } as any;
}

// Simple ID generator wrapper for consistency
const generateId = () => crypto.randomUUID();

describe('Matrimonial Service – Unit & Integration Tests', () => {
  const userA = generateId(); // owner
  const userB = generateId(); // viewer / other user

  test('Age rule – male must be >=21', () => {
    const underageMale = makeProfile({
      gender: Gender.Male,
      dateOfBirth: new Date().toISOString().split('T')[0], // today => age 0
    });
    assert.throws(
      () =>
        matrimonialService.createProfile(userA, {
          ...underageMale,
          ownerUserId: userA,
          photos: [],
          privacySettings: undefined,
        }),
      /Male profiles must be at least 21 years old/
    );
  });

  test('Age rule – female must be >=18', () => {
    const underageFemale = makeProfile({
      gender: Gender.Female,
      dateOfBirth: new Date().toISOString().split('T')[0],
    });
    assert.throws(
      () =>
        matrimonialService.createProfile(userA, {
          ...underageFemale,
          ownerUserId: userA,
          photos: [],
          privacySettings: undefined,
        }),
      /Female profiles must be at least 18 years old/
    );
  });

  test('Create valid profiles for two users', () => {
    const profileA = matrimonialService.createProfile(userA, {
      createdBy: CreatedBy.Self,
      name: 'Owner A',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
      subCaste: 'Kshatriya',
      photos: [],
      privacySettings: undefined,
    });
    const profileB = matrimonialService.createProfile(userB, {
      createdBy: CreatedBy.Self,
      name: 'Viewer B',
      gender: Gender.Female,
      dateOfBirth: '1995-05-05',
      subCaste: 'Vaishya',
      photos: [],
      privacySettings: undefined,
    });
    assert.strictEqual(profileA.ownerUserId, userA);
    assert.strictEqual(profileB.ownerUserId, userB);
  });

  test('Send interest, prevent duplicates, enforce monthly limit', () => {
    const owner = matrimonialService.createProfile(userA, {
      createdBy: CreatedBy.Self,
      name: 'Owner',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
      subCaste: 'Brahmin',
      photos: [],
      privacySettings: undefined,
    });
    const viewer = matrimonialService.createProfile(userB, {
      createdBy: CreatedBy.Self,
      name: 'Viewer',
      gender: Gender.Female,
      dateOfBirth: '1995-01-01',
      subCaste: 'Shudra',
      photos: [],
      privacySettings: undefined,
    });

    const interest1 = matrimonialService.sendInterest(viewer.id, owner.id);
    assert.strictEqual(interest1.status, RelationStatus.Pending);

    // duplicate pending should throw
    assert.throws(
      () => matrimonialService.sendInterest(viewer.id, owner.id),
      /Interest already exists/
    );

    // simulate reaching monthly limit (30 requests allowed)
    for (let i = 0; i < 29; i++) {
      const dummy = generateId();
      const dummyProfile = matrimonialService.createProfile(userB, {
        createdBy: CreatedBy.Self,
        name: `Dummy${i}`,
        gender: Gender.Female,
        dateOfBirth: '1995-01-01',
        subCaste: 'Vaishya',
        photos: [],
        privacySettings: undefined,
      });
      matrimonialService.sendInterest(dummyProfile.id, owner.id);
    }
    const extraProfile = matrimonialService.createProfile(userB, {
      createdBy: CreatedBy.Self,
      name: 'Extra',
      gender: Gender.Female,
      dateOfBirth: '1995-01-01',
      subCaste: 'Vaishya',
      photos: [],
      privacySettings: undefined,
    });
    assert.throws(
      () => matrimonialService.sendInterest(extraProfile.id, owner.id),
      /Monthly connection request limit reached/
    );
  });

  test('Interest response flow updates status', () => {
    const responseOwnerId = generateId();
    const responseViewerId = generateId();
    const owner = matrimonialService.createProfile(responseOwnerId, {
      createdBy: CreatedBy.Self,
      name: 'Owner2',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
      subCaste: 'Brahmin',
      photos: [],
      privacySettings: undefined,
    });
    const viewer = matrimonialService.createProfile(responseViewerId, {
      createdBy: CreatedBy.Self,
      name: 'Viewer2',
      gender: Gender.Female,
      dateOfBirth: '1995-01-01',
      subCaste: 'Shudda',
      photos: [],
      privacySettings: undefined,
    });

    const owner = matrimonialService.createProfile(responseOwnerId, {
      createdBy: CreatedBy.Self,
      name: 'Owner2',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
      subCaste: 'Brahmin',
      photos: [],
      privacySettings: undefined,
    });
    const viewer = matrimonialService.createProfile(responseViewerId, {
      createdBy: CreatedBy.Self,
      name: 'Viewer2',
      gender: Gender.Female,
      dateOfBirth: '1995-01-01',
      subCaste: 'Shudda',
      photos: [],
      privacySettings: undefined,
    });
    const interest = matrimonialService.sendInterest(viewer.id, owner.id);
    const accepted = matrimonialService.respondInterest(interest.id, 'accept');
    assert.strictEqual(accepted.status, RelationStatus.Accepted);
    const declined = matrimonialService.respondInterest(interest.id, 'decline');
    assert.strictEqual(declined.status, RelationStatus.Declined);
  });

  test('Block prevents profile access', () => {
    const owner = matrimonialService.createProfile(userA, {
      createdBy: CreatedBy.Self,
      name: 'OwnerBlock',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
      subCaste: 'Brahmin',
      photos: [],
      privacySettings: undefined,
    });
    const viewer = matrimonialService.createProfile(userB, {
      createdBy: CreatedBy.Self,
      name: 'ViewerBlock',
      gender: Gender.Female,
      dateOfBirth: '1995-01-01',
      subCaste: 'Shudra',
      photos: [],
      privacySettings: undefined,
    });
    matrimonialService.blockUser(userA, userB);
    assert.throws(() => matrimonialService.getProfile(userB, owner.id), /Access blocked/);
    assert.throws(() => matrimonialService.getProfile(userA, viewer.id), /Access blocked/);
  });

  test('Delete profile removes it and associated interests', () => {
    const owner = matrimonialService.createProfile(userA, {
      createdBy: CreatedBy.Self,
      name: 'OwnerDel',
      gender: Gender.Male,
      dateOfBirth: '1990-01-01',
      subCaste: 'Brahmin',
      photos: [],
      privacySettings: undefined,
    });
    const viewer = matrimonialService.createProfile(userB, {
      createdBy: CreatedBy.Self,
      name: 'ViewerDel',
      gender: Gender.Female,
      dateOfBirth: '1995-01-01',
      subCaste: 'Shudra',
      photos: [],
      privacySettings: undefined,
    });
    const interest = matrimonialService.sendInterest(viewer.id, owner.id);
    // ensure interest exists
    assert.doesNotThrow(() => matrimonialService.respondInterest(interest.id, 'accept'));

    // Delete owner profile
    const result = matrimonialService.deleteProfile(userA, owner.id);
    assert.strictEqual(result, true);
    // Profile should no longer be retrievable
    assert.throws(() => matrimonialService.getProfile(userB, owner.id), /Profile not found/);
    // Interest referencing the deleted profile should be removed
    assert.throws(() => matrimonialService.respondInterest(interest.id, 'decline'), /Interest not found/);
  });
});
