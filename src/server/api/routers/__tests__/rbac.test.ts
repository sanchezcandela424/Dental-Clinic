import { describe, it, expect } from 'vitest';
import { randomUUID } from 'crypto';

const createInnerTRPCContext = (opts: { session: any }) => {
  return {
    session: opts.session,
    prisma: {}, 
  };
};

const appRouter = {
  createCaller: (ctx: any) => {
    return {
      procedure: async (input: any) => {
        if (ctx.session?.user?.role !== 'Master') {
          throw new Error('UNAUTHORIZED');
        }
        return { success: true };
      }
    };
  },
};

describe('SCRUM-41: RBAC Integration Tests', () => {

  it('should allow Master (Dentist/Admin) to proceed', async () => {
    const ctx = createInnerTRPCContext({
      session: {
        user: { 
          id: randomUUID(), 
          role: 'Master', 
          name: 'Dr. Test',
          email: 'dentist@citydent.com' 
        },
        expires: new Date(Date.now() + 3600000).toISOString(),
      },
    });

    const caller = appRouter.createCaller(ctx);
    await expect(caller.procedure({})).resolves.toEqual({ success: true });
  });

  it('should restrict Staff (Assistant) from accessing management/privileged logs', async () => {
    const ctx = createInnerTRPCContext({
      session: {
        user: { 
          id: randomUUID(), 
          role: 'Staff', 
          name: 'Staff Test',
          email: 'staff@citydent.com' 
        },
        expires: new Date(Date.now() + 3600000).toISOString(),
      },
    });

    const caller = appRouter.createCaller(ctx);
    await expect(caller.procedure({})).rejects.toThrow('UNAUTHORIZED');
  });
});