import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const addressRepository = {
  findByUser(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  },

  findById(id: string) {
    return prisma.address.findUnique({ where: { id } });
  },

  async create(
    userId: string,
    data: Omit<Prisma.AddressUncheckedCreateInput, "userId" | "id">,
  ) {
    // Si c'est la première adresse, elle devient l'adresse par défaut.
    const count = await prisma.address.count({ where: { userId } });
    return prisma.address.create({
      data: { ...data, userId, isDefault: count === 0 || !!data.isDefault },
    });
  },

  update(id: string, data: Prisma.AddressUpdateInput) {
    return prisma.address.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.address.delete({ where: { id } });
  },

  async setDefault(userId: string, addressId: string) {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ]);
  },
};
