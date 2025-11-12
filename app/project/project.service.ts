// src/modules/projects/project.service.ts

import { ProjectionType, QueryOptions } from "mongoose";
import {ProjectModel} from "./project.schema";
import { IProject } from "./project.dto";

// Create project
export const createProject = async (
    data: Omit<IProject, "_id" | "createdAt" | "updatedAt">
) => {
    const result = await ProjectModel.create(data);
    return result.toJSON();
};

// Fetch all active projects
export const fetchAllProjects = async (
    projection?: ProjectionType<IProject>,
    options?: QueryOptions<IProject>
) => {
    const projects = await ProjectModel.find({ isActive: true }, projection, options).lean();
    return projects;
};
 // admin user ID
// Fetch project by ID
export const fetchProjectById = async (
    id: string,
    projection?: ProjectionType<IProject>,
    options?: QueryOptions<IProject>
) => {
    const project = await ProjectModel.findById(id, projection, options);
    return project;
};

// Update project
export const updateProject = async (id: string, data: Partial<IProject>) => {
    const updatedProject = await ProjectModel.findOneAndUpdate(
        { _id: id },
        data,
        { new: true }
    );

    return updatedProject;
};

// soft delete
export const deleteProject = async (id: string) => {
    const deleted = await ProjectModel.findOneAndUpdate(
        { _id: id },
        { isActive: false },
        { new: true }
    );
    return deleted;
};
