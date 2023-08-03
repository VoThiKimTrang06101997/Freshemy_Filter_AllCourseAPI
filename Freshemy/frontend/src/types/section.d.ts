import { Lesson } from "./lesson";

export type Section = {
    id: number;
    title: string;
    lessons?: Lesson[]
};

export type AddSection = {
    course_id: number;
    title: string;
};

export type EditSection = {
    id: number;
    title: string;
};

export type SectionRender = {
    title: string;
    updated_at: string;
    lessons: Lesson[];
};
