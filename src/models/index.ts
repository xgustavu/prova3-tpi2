import mongoose from "mongoose";
const { Schema } = mongoose;

const MilitarSchema = new Schema({
    nome: { type: String, maxlength: [50, "O nome pode ter no máximo 50 caracteres"], required: true },
    idade: {
        type: Number, maxlength: [3, "A idade deve ter no máximo 3 caracteres"],
        validate: {
            validator: function(idade: number){
                return idade >= 18;
            },
            message: (props: any) => `O indicado não é maior de Idade (${props.value}) anos`,
        },
    },
    email: {
        type: String,
        maxlength: [100, "O e-mail deve ter no máximo 100 caracteres"],
        unique: true,
        required: [true, "O e-mail é obrigatório"],
        validate: {
            validator: function (value: string) {
                // Expressão regular para validar e-mails de militares das forças armadas brasileiras
                const regex = /^[^\s@]+@(eb|marinha|fab)\.mil\.br$/i;
                return regex.test(value);
            },
            message: (props: any) =>
                `${props.value} não é um e-mail válido. Apenas e-mails das forças armadas brasileiras (com @eb, @marinha ou @fab e sufixo .mil.br) são aceitos.`,
        },
    },
    fone: {
        type: String, 
        maxlength: [11, "O telefone deve ter no máximo 11 caracteres"],
        required: [true, "O telefone é obrigatório"],
        validate: {
            validator: function (value: string) {
                // Expressão regular para validar o formato do número de telefone (10 ou 11 dígitos)
                const regex = /^[0-9]{10,11}$/;
        
                // Verifica o formato geral
                if (!regex.test(value)) {
                    return false;
                }
        
                // Extrai os dois primeiros dígitos (DDD) e valida se estão entre 11 e 99
                const ddd = parseInt(value.substring(0, 2), 10);
                return ddd >= 11 && ddd <= 99;
            },
            message: (props: any) =>
                `${props.value} não é um número de telefone válido. Deve conter de 10 a 11 dígitos e ter um DDD válido entre 11 e 99.`,
        },
    },
}, { timestamps: true, collection: "militar" });

const SoldadoSchema = new Schema({
    cim: { 
        type: Number, maxlength: 10, 
        required: true,
        unique: true,
    },
    altura: { 
        type: Number, 
        required: [true, "A altura é obrigatória"],
        min: [1.62, "A altura mínima é 1.62m, mas foi fornecida {VALUE}m."]
    },
    
    
    militar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Militar",
        require: [true, "Militar é obrigatório"],
        validate: {
            validator: async function(id:string){
                const militar = await Militar.findById(id);
                return !!militar; 
            },
            message: "O militar fornecido não existe"
        }
    },
}, { timestamps: true, collection: "soldado" });

const PatenteSchema = new Schema({
    codigo: {
        type: Number, maxlength: [2, "O código deve ter no máximo 2 caracteres"],
        validate: {
            validator: function (codigo: number) {
                return codigo > 0 && codigo <= 20;
            },
            message: (props: any) => `O código deve estar entre 0 e 20, valor fornecido = ${props.value}.`,
        },
    },
    descricao: {
        type: String,
        require: [true, "Descricao é obrigatória"],
    },
}, { timestamps: true, collection: "patente" });

const Militar = mongoose.model("Militar", MilitarSchema);
const Soldado = mongoose.model("Soldado", SoldadoSchema);
const Patente = mongoose.model("Patente", PatenteSchema);

export { Militar, Soldado, Patente };