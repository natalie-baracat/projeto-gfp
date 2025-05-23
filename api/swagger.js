import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: '3.0.4',
    info: {
        title: 'API do Gestor Financeiro Pessoal',
        version: '1.0.0',
        description: `API para gerenciamento financeiro pessoal desenvolvida no curso Técnico de Desenvolvimento de Sistemas do SENAI`
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Servidor Local'
        },
        {
            url: 'http://192.168.0.237:3000/',
            description: 'Servidor do Prof. Douglas'
        }
    ],
    tags: [
        {
            name: 'Usuarios',
            description: 'Rotas para cadastro, login, atualização e desativação de usuários'
        },
        {
            name: 'Categorias',
            description: 'Rotas para cadastro, login, atualização e desativação de categorias'
        },
        {
            name: 'Subcategorias',
            description: 'Rotas para cadastro, login, atualização e desativação de subcategorias'
        },
        {
            name: 'Transações',
            description: 'Rotas para cadastro, login, atualização e desativação de transações'
        },
        {
            name: 'Contas',
            description: 'Rotas para cadastro, login, atualização e desativação de contas'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        // USUARIOS | obs: é possivel colocar mais de um metodo na mesma rota! eu so nao quis mesmo
        '/usuarios/new': {
            post: {
                tags: ['Usuarios'],
                summary: 'Cadastrar novo usuário',
                description: 'Método utilizado para cadastrar novos usuários',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'email', 'senha', 'tipo_acesso'],
                                properties: {
                                    nome: { type: 'string', example: 'João Silva' },
                                    email: { type: 'string', example: 'joao@example.com' },
                                    senha: { type: 'string', example: '123' },
                                    tipo_acesso: { type: 'string', example: 'adm' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Usuário cadastrado com sucesso'
                    },
                    '400': {
                        description: 'Erro ao cadastrar usuário'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            }
        },

        '/usuarios': {
            get: {
                tags: ['Usuarios'],
                summary: 'Listar todos os usuários',
                description: 'Método utilizado para listar todos os usuários cadastrados',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de usuários',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
        },

        '/usuarios/{id_usuario}': {
            delete: {
                tags: ['Usuarios'],
                summary: 'Desativar usuario',
                description: 'Rota para desativar usuario',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                'parameters': [
                    {
                        name: 'id_usuario',
                        in: 'path', // caso queira passar como query use in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': { description: 'Usuario desativado com sucesso' },
                    '500': { description: 'Erro ao desativar usuarios' }
                }
            }
        },

        '/usuarios/login': {
            post: {
                tags: ['Usuarios'],
                summary: 'Login do usuário',
                description: 'Método utilizado para efetuar o login do usuário e gerar o token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'senha'],
                                properties: {
                                    email: { type: 'string', example: 'natalie@email' },
                                    senha: { type: 'string', example: '7' },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuário encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            token: { type: 'string', example: 'jkdnaskjdbaskjndlaksnmmlmcaj21lekn1lkn213n12jb3kj 21' },
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Erro ao encontrar usuário'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
        },

        'usuarios/editar/{id_usuario}': {
            patch: {
                tags: ['Usuarios'],
                summary: 'editar novo usuário',
                description: 'Método utilizado para editar novos usuários',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                // required: ['nome', 'email', 'senha', 'tipo_acesso'],
                                properties: {
                                    email: { type: 'string', example: 'amity@example.com' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuário editado com sucesso'
                    },
                    '400': {
                        description: 'Erro ao editar usuário'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
        },


        // CATEGORIAS
        '/categorias/new': {
            post: {
                tags: ['Categorias'],
                summary: 'Nova categoria',
                description: 'Cadastro de categoria',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_transacao', 'gasto_fixo', 'id_usuario'],
                                properties: {
                                    nome: { type: 'string', example: 'Alimentação' },
                                    tipo_transacao: { type: 'string', example: 'ENTRADA ou SAIDA' },
                                    gasto_fixo: { type: 'boolean', example: false },
                                    id_usuario: { type: 'integer', example: 7 },
                                    cor: { type: 'string', example: '#B00B5F' },
                                    icone: { type: 'string', example: 'house' }
                                }
                            }
                        }
                    }
                }
            },
            
        },

        '/categorias': {
            get: {
                tags: ['Categorias'],
                summary: 'Listar todas as categorias',
                description: 'Método utilizado para listar todas as categorias cadastrados',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de categorias',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            nome: { type: 'string', example: 'Alimentação' },
                                            tipo_transacao: { type: 'string', example: 'SAIDA' },
                                            gasto_fixo: { type: 'boolean', example: false },
                                            id_usuario: { type: 'integer', example: 7 },
                                            cor: { type: 'string', example: '#B00B5F' },
                                            icone: { type: 'string', example: 'utensils' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
        },

        '/categorias/{id_categoria}': {
            delete: {
                tags: ['Categorias'],
                summary: 'Desativar categoria',
                description: 'Rota para desativar categoria',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                'parameters': [
                    {
                        name: 'id_categoria',
                        in: 'path', // caso queira passar como query use in: 'query'
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': { description: 'categoria desativado com sucesso' },
                    '500': { description: 'Erro ao desativar categoria' }
                }
            }
        },

        'categorias/editar/{id_categoria}': {
            patch: {
                tags: ['Categorias'],
                summary: 'editar novo usuário',
                description: 'Método utilizado para editar novos usuários',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    gasto_fixo: { type: 'boolean', example: false }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuário editado com sucesso'
                    },
                    '400': {
                        description: 'Erro ao editar usuário'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
        },
    }
}

const options = {
    swaggerDefinition,
    apis: []
}

const swaggerSpec = swaggerJSDoc(options)
export default swaggerSpec