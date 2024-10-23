import { z } from "zod";

export const courseInfoSchema = z.object({
    name:z.string(),
    description : z.string(),
    price : z.string(),
    estimatedPrice : z.string(),
    tags: z.string(),
    level : z.string(),
    demoUrl : z.string(),
    thumbnail : z.string(),
})

export const courseBenefitSchema = z.object({
    title : z.string()
})

export const coursePrerequisiteSchema = z.object({
    title : z.string()
})
export const coursePrerequisitesSchema = 
        z.array(coursePrerequisiteSchema);


export const courseDataInsideSchema = z.object({
    videoUrl : z.string(),
    title : z.string(),
    description : z.string(),
})

export const courseContentDataSchema = z.object({
    videoSection : z.string(),
    courseDataInside : z.array(courseDataInsideSchema),
    suggestion : z.string()
})

export const createCourseSchema = z.object({
    courseInfo : courseInfoSchema,
    benefits : z.array(courseBenefitSchema),
    prerequisites : z.array(coursePrerequisiteSchema),
    courseContentData : z.array(courseContentDataSchema)
})

export type zodCourseInfo = z.infer<typeof courseInfoSchema>;
export type zodCourseBenefit = z.infer<typeof courseBenefitSchema>;
export type zodCoursePrerequisite = z.infer<typeof coursePrerequisiteSchema>;
export type zodCourseDataInside = z.infer<typeof courseDataInsideSchema>;
export type zodCourseContentData = z.infer<typeof courseContentDataSchema>;
export type zodCreateCourse = z.infer<typeof createCourseSchema>;
