import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { EditSection as EditSectionType, Section as SectionType } from "../../types/section";
import { Response } from "../../types/response";
import SectionApis from "@src/apis/section";

type SectionSlice = {
    title: string;
    sectionList: SectionType[];
    isLoading: boolean;
    isGetLoading: boolean;
};

export const addSection = createAsyncThunk<Response<null>, SectionType, { rejectValue: Response<null> }>(
    "section/addSection",
    async (body, ThunkAPI) => {
        try {
            const response = await SectionApis.addSection(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const editSection = createAsyncThunk<Response<null>, EditSectionType, { rejectValue: Response<null> }>(
    "section/editSection",
    async (body, ThunkAPI) => {
        try {
            const response = await SectionApis.editSection(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const deleteSection = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "section/deleteSection",
    async (body, ThunkAPI) => {
        try {
            const response = await SectionApis.deleteSection(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

export const getSectionByCourseId = createAsyncThunk<Response<SectionType[]>, number, { rejectValue: Response<null> }>(
    "section/getSectionByCourseId",
    async (body, ThunkAPI) => {
        try {
            const response = await SectionApis.getSectionByCourseId(body);
            return response.data as Response<SectionType[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    }
);

const initialState: SectionSlice = {
    title: "",
    sectionList: [],
    isLoading: false,
    isGetLoading: false,
};

export const sectionSlice = createSlice({
    name: "section",
    initialState: initialState,
    reducers: {
        setDeleteSection: (state, action: PayloadAction<number>) => {
            state.sectionList = state.sectionList.filter((section: SectionType) => section.id !== action.payload);
        },
        setEditSection: (state, action: PayloadAction<SectionType>) => {
            state.sectionList = state.sectionList.map((section: SectionType) => {
                if (section.id === action.payload.id) {
                    section.title = action.payload.title;
                }
                return section;
            });
        },
    },
    extraReducers: (builder) => {
        // add section
        builder.addCase(addSection.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(addSection.fulfilled, (state) => {
            state.isLoading = false;
        });

        builder.addCase(addSection.rejected, (state) => {
            state.isLoading = false;
        });

        // edit section
        builder.addCase(editSection.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(editSection.fulfilled, (state) => {
            state.isLoading = false;
        });

        builder.addCase(editSection.rejected, (state) => {
            state.isLoading = false;
        });

        // delete section
        builder.addCase(deleteSection.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(deleteSection.fulfilled, (state) => {
            state.isLoading = false;
        });

        builder.addCase(deleteSection.rejected, (state, action) => {
            state.isLoading = false;
        });

        // delete section
        builder.addCase(getSectionByCourseId.pending, (state) => {
            state.isGetLoading = true;
        });

        builder.addCase(getSectionByCourseId.fulfilled, (state, action) => {
            state.sectionList = action.payload.data as SectionType[];
            state.isGetLoading = false;
        });

        builder.addCase(getSectionByCourseId.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

export const { setDeleteSection, setEditSection } = sectionSlice.actions;

export default sectionSlice.reducer;
