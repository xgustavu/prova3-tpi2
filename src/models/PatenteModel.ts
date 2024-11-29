class PatenteModel{
    id: string = "";
    codigo: number;
    descricao: string;

    constructor(descricao: string, codigo: number){
        this.descricao = descricao;
        this.codigo = codigo;
    };
};

export default PatenteModel;