// src/modules/projects/project.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { createResponse } from "../common/helper/response.helper";
import * as projectService from "./project.service";
import { IProject } from "./project.dto";

// Create project
export const createProject = asyncHandler(async (req: Request, res: Response) => {
    const adminId = (req.user as any)._id;

    const filePaths = req.files
    ? (req.files as Express.Multer.File[]).map((f) => `/uploads/projects/${f.filename}`)
    : [];

    const projectData = {
        ...req.body,
        files: filePaths,
        createdBy: adminId,
    };

    const newProject = await projectService.createProject(projectData);

    res.status(201).send(createResponse(newProject, "Project created successfully"));
});

// Get all active projects
export const getAllProjects = asyncHandler(async (_req: Request, res: Response) => {
    const projects = await projectService.fetchAllProjects();
    res.send(createResponse(projects, "Projects fetched successfully"));
});

// Get project by ID
export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.fetchProjectById(req.params.id);

    if (!project) throw createHttpError(404, "Project not found");

    res.send(createResponse(project, "Project fetched successfully"));
});

// Update project
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const filePaths = req.files
    ? (req.files as Express.Multer.File[]).map((f) => `/uploads/projects/${f.filename}`)
    : [];

    if (filePaths.length) {
        req.body.files = filePaths;
      }

    const updatedProject = await projectService.updateProject(projectId, req.body);

    if (!updatedProject) throw createHttpError(404, "Project not found");

    res.send(createResponse(updatedProject, "Project updated successfully"));
});

// Soft delete
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.id;

    const deletedProject = await projectService.deleteProject(projectId);

    if (!deletedProject) throw createHttpError(404, "Project not found");

    res.send(createResponse({}, "Project deleted successfully"));
});
