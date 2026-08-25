import z from "zod";

export const updateAdminZodSchema = z.object({
  admin: z
    .object({
      name: z.string("Name must be a string").optional(),
      profilePhoto: z.url("Profile photo must be a valid URL").optional(),
      contactNumber: z
        .string("Contact number must be a string")
        .min(11, "Contact number must be at least 11 characters")
        .max(14, "Contact number must be at most 15 characters")
        .optional(),
    })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z.string("Name must be a string").optional(),

  profilePhoto: z.url("Profile photo must be a valid URL").optional(),

  contactNumber: z
    .string("Contact number must be a string")
    .min(11, "Contact number must be at least 11 characters")
    .max(14, "Contact number must be at most 14 characters")
    .optional(),

  status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional(),
});

export const getUsersQueryValidationSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(100).optional(),

  search: z.string().optional(),

  status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional(),
});
