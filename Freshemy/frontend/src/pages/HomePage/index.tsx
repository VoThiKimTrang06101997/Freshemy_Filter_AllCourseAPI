import React, { useEffect } from "react";
import { Navbar, Spin } from "@src/components";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { courseActions } from "@redux/slice";
import { Course as CourseType } from "../../types/course";
import CardVideo from "./CardVideo";
import CategoryCard from "./CategoryCard";
import { Category as CategoryType } from "../../types/course";
import CategoryIcon from "@src/components/icons/CategoryIcon";
import { User } from "../../types/user";

const Home: React.FC = () => {
    const thumbnail: React.FC[] = CategoryIcon;

    const categories: CategoryType[] = useAppSelector((state) => state.courseSlice.categories) ?? [];
    const top10Course: CourseType[] = useAppSelector((state) => state.courseSlice.courses) ?? [];
    const isLoading = useAppSelector((state) => state.courseSlice.isLoading);

    const dispatch = useAppDispatch();

    useEffect(() => {
        //@ts-ignore
        dispatch(courseActions.getCategories());
        // @ts-ignore
        dispatch(courseActions.getTop10Courses());
    }, [dispatch]);

    return (
        <>
            <Navbar />
            {isLoading && <Spin />}
            <div className="h-[200px] tablet:h-[400px] flex items-center bg-hero-pattern bg-cover mt-[100px] laptop:mt-0">
                <div className="px-24">
                    <h1 className="text-title text-2xl tablet:text-[40px] font-bold min-w-fit">LEARN NEW SKILLS</h1>
                    <p className="text-xl font-medium">Learn as hard as you can</p>
                </div>
            </div>
            <div className="container mx-auto">
                <div className="my-4 px-4">
                    <h2 className="text-xl tablet:text-3xl font-bold mb-3">Popular courses</h2>
                    <span className="w-[60px] h-1 bg-black block"></span>
                    <div className="w-full flex overflow-x-scroll">
                        <div className="mt-3 flex shrink-0 gap-3 py-2">
                            {top10Course.map((course: CourseType) => {
                                return (
                                    <CardVideo
                                        thumbnail={course.thumbnail}
                                        title={course.title}
                                        author={course.author as User}
                                        rating={course.rating}
                                        categories={course.categories}
                                        slug={course.slug}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="my-4 px-4">
                    <h2 className="text-xl tablet:text-3xl font-bold mb-3">Most category</h2>
                    <span className="w-[60px] h-1 bg-black block"></span>
                    <div className="mt-3 grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 gap-3">
                        {categories.map((category) => {
                            return (
                                <CategoryCard
                                    key={category.id}
                                    id={category.id}
                                    title={category.title}
                                    thumbnail={thumbnail[category.id]}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="w-full h-[120px] bg-backgroundHover flex flex-col justify-center items-center mt-4">
                <p className="text-xl mb-2 font-bold">Trusted by more than 13400 amazing teams</p>
                <p className="text-lg">Top companies use these same courses to help employees hone their skills.</p>
            </div>
        </>
    );
};

export default Home;
