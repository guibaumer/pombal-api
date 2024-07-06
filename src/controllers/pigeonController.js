import { Pigeon } from '../models/pigeonModel.js';
import cloudinary from '../../config/cloudinary.js';
import { response } from 'express';

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
    const { anilha, anilhaFather, anilhaMother } = req.body;

    const photo = req.file;

    const errors = [];

    if (!anilha || anilha.length > 15) errors.push('Adicione um valor válido para anilha');

    if (anilhaFather && anilhaFather.length > 15) {
        errors.push('Anilha não pode ter mais de 15 caracteres');
    }
      if (anilhaMother && anilhaMother.length > 15) {
        errors.push('Anilha não pode ter mais de 15 caracteres');
    }

    const existingPigeon = await Pigeon.findOne({ where: { anilha } });
    if (existingPigeon) {
        errors.push('Anilha já registrada');
    }
    
    if (!photo) errors.push('Adicione uma foto');

    if (errors.length) {
        return res.status(400).send({ errors: errors });
    }

    const uploadResult = await cloudinary.uploader
    .upload(
        photo.path,
        { folder: 'pigeons' }
    )
    .catch((error) => {
        console.log(error);
        return res.status(500).send({ message: 'Erro ao fazer upload. Tente novamente mais tarde'});
    });
    
    const foto_path = uploadResult.secure_url;
    const newPigeonRegister = {
        anilha,
        foto_path,
        father_anilha: anilhaFather,
        mother_anilha: anilhaMother
    };
    
    try {
        await Pigeon.create(newPigeonRegister);
        res.send({ message: 'Registro realizado' });
    } catch(err) {
        res.status(500).send({ message: 'Erro: tente novamente depois' });
        console.log(err);
    }
}



// export const EditPigeon = async (req, res) => {
//     const { name, lastname } = req.body;

//     if (!name || !lastname) return res.send({message: 'Dados não enviados'}).status(400);

//     const errors = [];

//     if (name.length < 3) errors.push('Nome deve ser maior ou igual a 3 caracteres.');
//     if (lastname.length < 3) errors.push('Sobrenome deve ser maior ou igual a 3 caracteres.');

//     if (errors.length) {
//         return res.status(400).send({message: errors});
//     }
    
//     try {
//         await User.update({ name: name, lastname: lastname }, { where: { id: req.session.user.user_id } });
//         res.send({message: 'Conta editada'});
//     } catch (err) {
//         res.send({ message: 'Erro ao editar usuário. Tente novamente mais tarde' }).status(500);
//         console.log(err);
//     }
// }

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

