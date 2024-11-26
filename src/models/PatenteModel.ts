class PatenteModel{
    id: string = "";
    codigo: number;
    descricao: string;

    constructor(codigo: number, descricao: string){
        this.codigo = codigo;
        this.descricao = descricao;
    };
};

export default PatenteModel;