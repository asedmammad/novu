import { MembersTable } from './MembersTable';
import { TestWrapper } from '../../testing';
import { MemberRoleEnum, MemberStatusEnum } from '@novu/shared';
import { SinonSpy } from 'cypress/types/sinon';

describe('MembersTable Component', function () {
  let onResendInviteMember: SinonSpy;
  let onRemoveMember: SinonSpy;

  beforeEach(() => {
    onResendInviteMember = cy.spy().as('resendInviteSpy');
    onRemoveMember = cy.spy().as('removeSpy');
  });

  it('should call callbacks when template remove member clicked', function () {
    const anotherMember = { _userId: 2, user: { email: 'another-test@email.com' }, roles: [MemberRoleEnum.ADMIN] };
    const members = [{ _userId: 1, user: { email: 'test@email.com' }, roles: [MemberRoleEnum.ADMIN] }, anotherMember];

    cy.mount(
      <TestWrapper>
        <MembersTable
          members={members}
          currentUser={{ _id: 1 }}
          onRemoveMember={onRemoveMember}
          onResendInviteMember={onResendInviteMember}
        />
      </TestWrapper>
    );

    cy.getByTestId('actions-row-btn').click();
    cy.getByTestId('remove-row-btn').click();
    cy.get('@removeSpy').should('have.been.calledWith', anotherMember);
  });

  it('should hide remove member button for current user', function () {
    const anotherMember = {
      _id: 2,
      _userId: 2,
      user: { email: 'another-test@email.com' },
      roles: [MemberRoleEnum.ADMIN],
    };

    const members = [
      { _id: 1, _userId: 1, user: { email: 'test@email.com' }, roles: [MemberRoleEnum.ADMIN] },
      anotherMember,
    ];

    cy.mount(
      <TestWrapper>
        <MembersTable
          members={members}
          currentUser={{ _id: 1 }}
          onRemoveMember={onRemoveMember}
          onResendInviteMember={onResendInviteMember}
        />
      </TestWrapper>
    );

    cy.get('[data-test-id="member-row-1"').within(() => {
      return cy.get('[data-test-id="actions-row-btn"]').should('not.be.exist');
    });
  });

  it('should hide remove buttons if missing roles', function () {
    const anotherMember = {
      _id: 2,
      _userId: 2,
      user: { email: 'another-test@email.com' },
      roles: [MemberRoleEnum.ADMIN],
    };

    const members = [
      { _id: 1, _userId: 1, user: { email: 'test@email.com' }, roles: [MemberRoleEnum.MEMBER] },
      anotherMember,
    ];

    cy.mount(
      <TestWrapper>
        <MembersTable
          members={members}
          currentUser={{ _id: 1 }}
          onRemoveMember={onRemoveMember}
          onResendInviteMember={onResendInviteMember}
        />
      </TestWrapper>
    );

    cy.get('[data-test-id="actions-row-btn"]').should('not.be.exist');
  });

  it('should call callbacks when template resend invite member clicked', function () {
    const anotherMember = {
      _userId: 2,
      user: { email: 'another-test@email.com' },
      roles: [MemberRoleEnum.ADMIN],
      memberStatus: MemberStatusEnum.INVITED,
    };
    const members = [{ _userId: 1, user: { email: 'test@email.com' }, roles: [MemberRoleEnum.ADMIN] }, anotherMember];

    cy.mount(
      <TestWrapper>
        <MembersTable
          members={members}
          currentUser={{ _id: 1 }}
          onRemoveMember={onRemoveMember}
          onResendInviteMember={onResendInviteMember}
        />
      </TestWrapper>
    );

    cy.getByTestId('actions-row-btn').click();
    cy.getByTestId('resend-invite-btn').click();
    cy.get('@resendInviteSpy').should('have.been.calledWith', anotherMember);
  });

  it('should hide resend invite member when member is already active clicked', function () {
    const anotherMember = {
      _userId: 2,
      user: { email: 'another-test@email.com' },
      roles: [MemberRoleEnum.ADMIN],
      memberStatus: MemberStatusEnum.ACTIVE,
    };
    const members = [{ _userId: 1, user: { email: 'test@email.com' }, roles: [MemberRoleEnum.ADMIN] }, anotherMember];

    cy.mount(
      <TestWrapper>
        <MembersTable
          members={members}
          currentUser={{ _id: 1 }}
          onRemoveMember={onRemoveMember}
          onResendInviteMember={onResendInviteMember}
        />
      </TestWrapper>
    );

    cy.getByTestId('actions-row-btn').click();
    cy.getByTestId('resend-invite-btn').should('not.be.exist');
  });

  it('should show loading state when is loading', function () {
    const anotherMember = { _userId: 2, user: { email: 'another-test@email.com' }, roles: [MemberRoleEnum.ADMIN] };
    const members = [{ _userId: 1, user: { email: 'test@email.com' }, roles: [MemberRoleEnum.ADMIN] }, anotherMember];

    cy.mount(
      <TestWrapper>
        <MembersTable
          members={members}
          currentUser={{ _id: 1 }}
          onRemoveMember={onRemoveMember}
          onResendInviteMember={onResendInviteMember}
          loading={true}
        />
      </TestWrapper>
    );

    cy.get('.mantine-LoadingOverlay-root').should('be.exist');
  });

  it('should not show loading state when is not loading', function () {
    const anotherMember = { _userId: 2, user: { email: 'another-test@email.com' }, roles: [MemberRoleEnum.ADMIN] };
    const members = [{ _userId: 1, user: { email: 'test@email.com' }, roles: [MemberRoleEnum.ADMIN] }, anotherMember];

    cy.mount(
      <TestWrapper>
        <MembersTable
          members={members}
          onResendInviteMember={onResendInviteMember}
          currentUser={{ _id: 1 }}
          onRemoveMember={onRemoveMember}
          loading={false}
        />
      </TestWrapper>
    );

    cy.get('.mantine-LoadingOverlay-root').should('not.be.exist');
  });
});
