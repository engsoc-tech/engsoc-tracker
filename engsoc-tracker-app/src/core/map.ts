import { ApplicationType } from "@/schemas/applications";
import { z } from 'zod';
import { EngineeringTypeSchema, EngineeringTypeType } from "../../prisma/generated/zod";
import { EngineeringType } from "@prisma/client";
//make an array of available types from the EngineeringType schema.
// Create an array of all engineering types
export const EngineeringTypes: EngineeringTypeType[] = Object.values(EngineeringType);
//create a type for SelectableEngineeringTypes
export type SelectableEngineeringType = EngineeringTypeType | "all";
export const SelectableEngineeringTypes: SelectableEngineeringType[] = [...EngineeringTypes, "all"];
export type EngineeringURLtype = "all-disciplines" | "aerospace" | "chemical-process" | "civil-building" | "computing-technology" | "electronic-electrical" | "mechanical-engineering";

