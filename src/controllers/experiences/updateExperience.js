import { getRowsData, updateRow } from '../../googleapis/methods/index.js';
import fs from 'fs/promises';
import path from 'path';
import {
    generateError,
    validationUpdateExperiences,
} from '../../utils/index.js';
import cloudinaryUpdate from '../cloudinary/updateImage.js';

const updateExperience = async (req, res, next) => {
    try {
        const id = req.params.id;
        const prevImage = req.query.image;
        const spreadsheetId = process.env.SPREADSHEET_ID;

        // Actualizar la imagen en Cloudinary:
        let newImage = 'Sin imagen';
        if (req.file) {
            console.log('HAY FILE EN BACK:', req.file);
            
            try {
                const response = await cloudinaryUpdate(req.file.path, prevImage, 'experiences');
                if (response.success) {
                    newImage = response.url;
                } else {
                    throw new Error(response.message || "Cloudinary update failed.");
                }
            } catch (error) {
                console.error('Error al actualizar:', error.message);
                generateError(error.message);
            }
        }

        // Datos nuevos:
        const experienceFromFront = req.body;
        const { error } = validationUpdateExperiences.validate(experienceFromFront);
        if (error) {
            error.message = error.details[0].message;
            generateError(error.message);
        }

        // Correctly assign the new image URL
        const image = newImage || req.body.image || 'Sin imagen';
        const newExperience = [id, experienceFromFront.text, image];

        console.log("CLOUDINARY IMAGE URL after update:", image);
        

        // Datos antiguos:
        const fields = {
            field: 'id',
            value: id,
            newValue: '',
            sheetName: 'Experiencias',
        };
        const matchingData = await getRowsData(spreadsheetId, 'Experiencias', fields);
        const { rowData } = matchingData;

        const experienceFromBack = rowData;

        // Datos actualizados:
        const updatedExperience = [
            id,
            experienceFromFront.text || experienceFromBack[1],
            image || experienceFromBack[2],
        ];
        const data = await getRowsData(spreadsheetId, 'Experiencias', fields, updatedExperience);
        const { rowToUpdate } = data;
        await updateRow(rowToUpdate);

        res.status(200).json({
            message: 'Experiencia actualizada correctamente.',
            data: newExperience,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
export default updateExperience;
