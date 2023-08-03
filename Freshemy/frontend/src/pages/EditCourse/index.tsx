import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { lessonActions, sectionActions } from "@redux/slice";
import { useParams } from "react-router-dom";
import { Accordion, DeleteModal, PopupAddLesson, Navbar } from "@src/components";
import { AddSection as AddSectionType, Section as SectionType } from "../../types/section";
import { courseActions } from "../../redux/slice";

import toast from "react-hot-toast";
import EditForm from "./EditForm";

const EditCourse: React.FC = () => {
    const [isDisplayDeleteModal, setIsDisplayDeleteModal] = useState<boolean>(false);
    const [isDisplayEditModal, setIsDisplayEditModal] = useState<boolean>(false);
    const [isDeleteSection, setIsDeleteSection] = useState<boolean>(false);
    const [isDisplayAddLessonModal, setIsDisplayAddLessonModal] = useState<boolean>(false);
    const sectionOfCourse: SectionType[] = useAppSelector((state) => state.sectionSlice.sectionList);

    const [section, setSection] = useState<string>("");
    const [idItem, setIdItem] = useState<number>(-1);
    const [itemTitle, setItemTitle] = useState<string>("");
    // const [itemVideo, setItemVideo] = useState<string>("");

    const isGetLoading = useAppSelector((state) => state.courseSlice.isGetLoading);

    const { course_id } = useParams();

    const dispatch = useAppDispatch();

    useEffect(() => {
        //@ts-ignore
        dispatch(courseActions.getCourseDetailById(course_id));
        //@ts-ignore
        dispatch(sectionActions.getSectionByCourseId(course_id));
    }, [dispatch, course_id]);

    const handleAddSection = () => {
        const values: AddSectionType = {
            course_id: Number(course_id),
            title: section,
        };
        // @ts-ignore
        dispatch(sectionActions.addSection(values)).then((response) => {
            if (response.payload.status_code === 201) {
                toast.success(response.payload.message);
                // @ts-ignore
                dispatch(sectionActions.getSectionByCourseId(course_id));
            } else {
                toast.error(response.payload.message);
            }
        });

        setSection("");
    };

    const handleDisplayDeleteModal = (id: number, isDeleteSection: boolean) => {
        setIdItem(id);
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
        if (isDeleteSection) {
            setIsDeleteSection(true);
        } else {
            setIsDeleteSection(false);
        }
    };

    const handleDisplayAddSectionModal = (id: number) => {
        setIdItem(id);
        setIsDisplayAddLessonModal(!isDisplayAddLessonModal);
    };

    const handleCancelModal = () => {
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleCancelModalAddLesson = () => {
        setIsDisplayAddLessonModal(!isDisplayAddLessonModal);
    };

    const handleDeleteSection = () => {
        //@ts-ignore
        dispatch(sectionActions.deleteSection(idItem)).then((response) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(sectionActions.setDeleteSection(idItem));
            } else {
                toast.error(response.payload.message);
            }
        });
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleDeleteLesson = () => {
        //@ts-ignore
        dispatch(lessonActions.deleteLesson(idItem)).then((response) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                // @ts-ignore
                dispatch(sectionActions.getSectionByCourseId(course_id));
            } else {
                toast.error(response.payload.message);
            }
        });
        setIsDisplayDeleteModal(!isDisplayDeleteModal);
    };

    const handleEditSection = (id: number, title: string) => {
        // @ts-ignore
        dispatch(sectionActions.editSection({ id, title })).then((response) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                dispatch(sectionActions.setEditSection({ id, title }));
            } else {
                toast.error(response.payload.message);
            }
        });
        setIsDisplayEditModal(!isDisplayEditModal);
    };

    const handleDisplayEditLesson = (id: number, title: string, video: string) => {
        setIdItem(id);
        setItemTitle(title);
        // setItemVideo(video);
        // setIsDisplayEditLessonModal(!isDisplayAddLessonModal);
    };

    const handleDisplayEditModal = (id: number, title: string) => {
        setIdItem(id);
        setItemTitle(title);
        setIsDisplayEditModal(!isDisplayEditModal);
    };
    return (
        <>
            {isGetLoading !== true && (
                <>
                    <Navbar />
                    <div className="min-h-screen h-full px-4 tablet:px-[60px]">
                        <EditForm course_id={Number(course_id)} />

                        <div className="flex-1 p-4 flex flex-col border border-dashed border-black rounded-lg m-4">
                            <div className="flex flex-col gap-4 tablet:flex-row tablet:justify-between">
                                <input
                                    type="text"
                                    maxLength={100}
                                    className="px-2 py-2 rounded-lg border-[1px] outline-none flex-1 max-w-2xl"
                                    placeholder="Name's section"
                                    value={section}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setSection(e.target.value);
                                    }}
                                />
                                <button
                                    className="text-white btn btn-primary text-lg flex-2"
                                    onClick={handleAddSection}
                                >
                                    Add section
                                </button>
                            </div>
                            {/* handle list lesson */}
                            <div className="mt-2">
                                {sectionOfCourse.length <= 0 ? (
                                    <h1 className="text-center text-2xl text-error">There are no sections yet!</h1>
                                ) : (
                                    sectionOfCourse.map((section, index) => (
                                        <Accordion
                                            key={index}
                                            section={section}
                                            handleDeleteSection={handleDeleteSection}
                                            handleDisplayEditModal={handleDisplayEditModal}
                                            handleDisplayDeleteModal={handleDisplayDeleteModal}
                                            handleDisplayAddSectionModal={handleDisplayAddSectionModal}
                                            handleDisplayEditLesson={handleDisplayEditLesson}
                                            isDisplayBtn={true}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    {/* POPUP DELETE SECTION*/}
                    {isDisplayDeleteModal && isDeleteSection && (
                        <DeleteModal handleDelete={handleDeleteSection} handleCancel={handleCancelModal} />
                    )}
                    {/* POPUP DELETE LESSON*/}
                    {isDisplayDeleteModal && !isDeleteSection && (
                        <DeleteModal handleDelete={handleDeleteLesson} handleCancel={handleCancelModal} />
                    )}
                    {/* POPUP EDIT SECTION */}
                    {isDisplayEditModal && (
                        <div className="fixed z-50 w-full h-full top-0 bottom-0 bg-black/50 flex justify-center items-center shadow-lg">
                            <div className="bg-[#F8FFF8] p-4 w-[400px] flex flex-col items-center justify-center rounded-lg ">
                                <h1 className="text-3xl mb-1 font-bold text-center text-title">EDIT SECTION</h1>

                                <form className="flex flex-col gap-1 w-full">
                                    <div className="text-sm mb-1 tablet:text-xl font-medium">Section title</div>
                                    <input
                                        type="text"
                                        value={itemTitle}
                                        className="px-2 py-4 rounded-lg border-[1px] outline-none max-w-lg"
                                        onChange={(e) => setItemTitle(e.target.value)}
                                    />
                                </form>
                                <div className="mt-2 flex justify-end w-full">
                                    <button
                                        className="text-white btn btn-primary text-lg"
                                        onClick={() => handleEditSection(idItem, itemTitle)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn text-lg ml-2"
                                        onClick={() => setIsDisplayEditModal(!isDisplayEditModal)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* POPUP ADD LESSON */}
                    {isDisplayAddLessonModal && (
                        <PopupAddLesson
                            handleDelete={handleDeleteSection}
                            handleCancel={handleCancelModalAddLesson}
                            id={idItem}
                        />
                    )}
                    {/* POPUP EDIT LESSON */}
                </>
            )}
        </>
    );
};

export default EditCourse;
