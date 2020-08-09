module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.3.0',
    title: 'Books Restful API',
    description: 'A virtual fully fledged real library',
    termsOfService: 'http://swagger.io/terms/',
    contact: {
      name: 'Bruce Chariot',
      email: 'brucechariot@hotmail.com',
      url: 'https://www.youtube.com/watch?v=8ybW48rKBME'
    },
    license: {
      name: 'Apache 2.0',
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/',
      description: 'Local server'
    }
  ],
  security: [
    {
      ApiKeyAuth: []
    }
  ],
  tags: [
    {
      name: 'Rest API operations'
    }
  ],
  paths: {
    '/': {
      get: {
        tags: ['Rest API operations'],
        description: 'Get welcome page',
        operationId: 'getWelcome',
        parameters: [],
        responses: {
          '200': {
            description: 'Welcome page',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                },
                example: {
                  message: 'Welcome to Virtual library!'
                }
              }
            }
          }
        }
      }
    },
    '/book': {
      get: {
        tags: ['Rest API operations'],
        description: 'Get books from library',
        operationId: 'getBooks',
        parameters: [
          {
            name: 'id',
            in: 'query',
            schema: {
              type: 'integer'
            },
            required: false,
            description: 'Book index'
          }
        ],
        responses: {
          '200': {
            description: 'Books were obtained',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                },
                example: {
                  message: '"Dune*#*Gone With The Wind*#*The Lord Of The Rings*#*Advanced Calculus"'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Rest API operations'],
        description: 'Add a book to the library',
        operationId: 'addBook',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'string'
              },
              example: {
                book: 'Great Expectations'
              }
            }
          },
          required: true
        },
        responses: {
          '200': {
            description: 'A new book was added to the library',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                },
                example: {
                  message: "Book 'Great Expectations' has been added to the library"
                }
              }
            }
          },
          '406': {
            description: 'Error: Not Acceptable',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                },
                example: {
                  errorMessage: "Parameter 'book' required is missing"
                }
              }
            }
          },
          '409': {
            description: 'Error: Conflict',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                },
                example: {
                  errorMessage: "Book 'Great Expectations' already in the library"
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Rest API operations'],
        description: 'Remove a book from the library',
        operationId: 'deleteBook',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'string'
              },
              example: {
                book: 'Gone With The Wind'
              }
            }
          },
          required: true
        },
        responses: {
          '200': {
            description: 'A book was removed from the library',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                },
                example: {
                  message: 'Book "Gone With The Wind" has been removed from the library'
                }
              }
            }
          },
          '404': {
            description: 'Error: Not Found',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                },
                example: {
                  errorMessage: 'Book "Gone With The Wind" not found in the library'
                }
              }
            }
          },
          '406': {
            description: 'Error: Not Acceptable',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                },
                example: {
                  errorMessage: "Parameter 'book' required is missing"
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ['Rest API operations'],
        description: 'Rename a book in the library',
        operationId: 'patchBook',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'string'
              },
              example: {
                original_book: 'The Lord Of The Rings', new_book: 'The Hobbit'
              }
            }
          },
          required: true
        },
        responses: {
          '200': {
            description: 'A book was renamed in the library',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                },
                example: {
                  message: 'Book "The Lord Of The Rings" has been renamed to "The Hobbit" in the library'
                }
              }
            }
          },
          '404': {
            description: 'Error: Not Found',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                },
                example: {
                  errorMessage: 'Book "The Lord Of The Rings" not found in the library'
                }
              }
            }
          },
          '406': {
            description: 'Error: Not Acceptable',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                },
                example: {
                  errorMessage: "Parameter 'book' required is missing"
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Rest API operations'],
        description: 'Insert books from library into database',
        operationId: 'putBooks',
        parameters: [],
        responses: {
          '200': {
            description: 'Books were inserted into the database',
            content: {
              'application/json': {
                schema: {
                  type: 'string'
                },
                example: {
                  "Dune":59,
                  "Gone With The Wind":38,
                  "The Lord Of The Rings":15,
                  "Advanced Calculus":135
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
  }
};