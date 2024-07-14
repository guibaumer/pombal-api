import { Pigeon } from '../models/pigeonModel.js';
import cloudinary from '../../config/cloudinary.js';
import path from 'path';
import { Sequelize } from 'sequelize';

export const GetAllPigeons = async (req, res) => {
    try {
        const data = await Pigeon.findAll();
        return res.send({ entries: data });   
    } catch(err) {
        console.log(err);
        res.send({ error: 'Não foi possível buscar dados agora'})
    }
}

export const CreatePigeon = async (req, res) => {
    const { anilha, anilhaFather, anilhaMother, sex } = req.body;

    const photo = req.file;

    const errors = [];

    if (!anilha || anilha.length > 15) errors.push('Adicione um valor válido para anilha');

    if (anilhaFather && anilhaFather.length > 15) {
        errors.push('Anilha não pode ter mais de 15 caracteres');
    }
    if (anilhaMother && anilhaMother.length > 15) {
        errors.push('Anilha não pode ter mais de 15 caracteres');
    }

    if (!sex) {
        errors.push('Indique se o pombo é macho ou fêmea');
    }

    const existingPigeon = await Pigeon.findOne({ where: { anilha } });
    if (existingPigeon) {
        errors.push('Anilha já registrada');
    }
    
    const allowedExt = ['.jpg', '.jpeg', '.png'];
    if (photo && !allowedExt.includes(path.extname(photo.originalname))) {
        errors.push('Tipo de arquivo não suportado');
    }

    if (errors.length) {
        return res.status(400).send({ errors: errors });
    }

    let foto_path = null;

    if (photo) {
    const uploadResult = await cloudinary.uploader
    .upload(
        photo.path,
        { folder: 'pigeons' }
    )
    .catch((error) => {
        console.log(error);
        return res.status(500).send({ message: 'Erro ao fazer upload. Tente novamente mais tarde'});
    });
    
    foto_path = uploadResult.secure_url;
    }

    const newPigeonRegister = {
        anilha,
        foto_path,
        father_anilha: anilhaFather,
        mother_anilha: anilhaMother,
        sex
    };
    
    try {
        await Pigeon.create(newPigeonRegister);
        res.send({ message: 'Registro realizado' });
    } catch(err) {
        res.status(500).send({ message: 'Erro: tente novamente depois' });
        console.log(err);
    }
}

export const EditPigeon = async (req, res) => {
    const { anilha, anilhaFather, anilhaMother, sex, urlPhoto, id } = req.body;

    const photo = req.file;

    const errors = [];

    if (!id) errors.push('Error: missing ID');
    if (!anilha || anilha.length > 15) errors.push('Adicione um valor válido para anilha');
    if (anilhaFather && anilhaFather.length > 15) {
        errors.push('Anilha não pode ter mais de 15 caracteres');
    }
    if (anilhaMother && anilhaMother.length > 15) {
        errors.push('Anilha não pode ter mais de 15 caracteres');
    }
    if (sex && sex !== 'M' && sex !== 'F') {
        errors.push('Indique se o pombo é macho ou fêmea');
    }

    const existingPigeon = await Pigeon.findOne({
        where: {
          anilha,
          id: { [Sequelize.Op.not]: id } 
        }
      });
    
    if (existingPigeon) {
        errors.push('Anilha já registrada');
    }
    
    const allowedExt = ['.jpg', '.jpeg', '.png'];
    if (photo && !allowedExt.includes(path.extname(photo.originalname))) {
        errors.push('Tipo de arquivo não suportado');
    }

    if (errors.length) {
        return res.status(400).send({ errors: errors });
    }

    let foto_path = null;

    if (photo) {
    const uploadResult = await cloudinary.uploader
    .upload(
        photo.path,
        { folder: 'pigeons' }
    )
    .catch((error) => {
        console.log(error);
        return res.status(500).send({ message: 'Erro ao fazer upload. Tente novamente mais tarde'});
    });
    
    foto_path = uploadResult.secure_url;
    }

    const editedPigeon = {
        anilha,
        foto_path: foto_path || urlPhoto,
        father_anilha: anilhaFather,
        mother_anilha: anilhaMother,
        sex,
    };

    try {
        await Pigeon.update(editedPigeon, { where: { id } });
        res.send({ message: 'Registro atualizado' });
    } catch (err) {
        res.status(500).send({ message: 'Erro: tente novamente depois' });
        console.log(err);
    }

}

export const getPigeon = async (req, res) => {
    const { anilha } = req.body;

    console.log(req.body);
    console.log(anilha);

    if (!anilha) return res.status(400).send({ message: 'Número da anilha necessário' });

    try {
        const register = await Pigeon.findOne({ where: { anilha: anilha }});

        if (register) {
            return res.send({ pigeon: register });
        } else {
            return res.status(500).send({ message: 'Anilha não registrada' });
        }
    } catch(err) {
        console.log(err);
        return res.status(500).send({ message: 'Tente novamente mais tarde' })
    }
}

export const getPigeonPhoto = async (req, res) => {
    const { anilha } = req.body;

    console.log(anilha)

    if (!anilha) return res.status(400).send({ message: 'Número da anilha necessário' });

    try {
        const path = await Pigeon.findOne({
            attributes: ['foto_path'],
            where: { anilha },
        });

        if (path) {
            return res.send({ path });
        } else {
            return res.status(500).send({ message: 'Anilha não registrada' });
        }
    } catch(err) {
        console.log(err);
        return res.status(500).send({ message: 'Tente novamente mais tarde' })
    }
}

export const getOffspring = async (req, res) => {
    const { parentAnilha, sex } = req.body;

    console.log(parentAnilha, sex);

    try {
        if (sex === 'M') {
            const data = await Pigeon.findAndCountAll({ where: { father_anilha: parentAnilha }});
            console.log('---------PARENT: ' + data);
            return res.send({ entries: data });
        } else if (sex === 'F') {
            const data = await Pigeon.findAndCountAll({ where: { mother_anilha: parentAnilha }});
            console.log('---------PARENT: ' + data);
            return res.send({ entries: data });
        }
        else {
            return res.status(400).send({ message: 'Erro com os dados enviados'});
        }
    } catch(err) {
        console.log(err);
        res.status(500).send({ error: 'Erro ao buscar filhos' });
    }
}

export const deletePigeon = async (req, res) => {
    const { anilha } = req.body;

    if (!anilha) return res.status(400).send({error: 'Anilha não enviada'});

    try {
        const data = await Pigeon.destroy({ where: { anilha }});
        return res.send({ message: 'Registro deletado' });
    } catch(err) {
        console.log(err);
        res.status(500).send({ error: 'Erro ao deletar' });
    }
}