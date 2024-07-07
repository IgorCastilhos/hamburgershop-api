export class NotAManagerError extends Error {
    constructor() {
        super('Usuário não é gerente de um restaurante.');
    }
}
