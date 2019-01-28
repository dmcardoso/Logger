const yup = require('yup');

module.exports = app => {

    const new_project = async (project) => {
        const schema = yup.object().shape({
            name: yup.string().required("O campo nome é obrigatório"),
            path_debug: yup.string(),
            path_error: yup.string(),
            created_at: yup.date().default(function () {
                return new Date();
            })
        });

        const validate = await schema.validate({...project})
            .then(function (valid) {
                return valid;
            })
            .catch(function (error) {
                return error;
            });

        if (validate.errors !== undefined) return validate.errors;
        else return validate;
    };

    const update_project = async (project) => {
        const schema = yup.object().shape({
            id: yup.number().required("Para ser alterado é necessário informar o identificador do projeto").positive().integer(),
            name: yup.string().required("O campo nome é obrigatório"),
            path_debug: yup.string(),
            path_error: yup.string()
        });

        const validate = await schema.validate({...project})
            .then(function (valid) {
                return valid;
            })
            .catch(function (error) {
                return error;
            });

        if (validate.errors !== undefined) return validate.errors;
        else return validate;
    };

    return {new_project, update_project};

};