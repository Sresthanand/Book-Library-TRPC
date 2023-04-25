"use strict";

var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });

const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();

const uploadFile = require("../aws");

const upload = require("../middleware/multer");

const ExampleRouter = trpc_1.router({
  exampleWithArgs: trpc_1.publicProcedure
    .input(
      zod_1.z.object({
        message: zod_1.z.string(),
      })
    )
    .mutation((req) => {
      return { info: req.input.message };
    }),
  example: trpc_1.publicProcedure.query(({ ctx }) =>
    __awaiter(void 0, void 0, void 0, function* () {
      return { info: 42 };
    })
  ),
  registerBook: trpc_1.publicProcedure
    .input(
      zod_1.z.object({
        name: zod_1.z.string(),
        author: zod_1.z.string(),
        readTime: zod_1.z.string(),
        details: zod_1.z.string(),
      })
    )
    .mutation(async (req) => {
      const { name, author, readTime, details } = req.input;
      const createdBook = await prisma.book.create({
        data: {
          name,
          author,
          readTime,
          details,
        },
      });
      console.log("CreatedBook +" + createdBook.toString());
      return { book: createdBook };
    }),
  getBooks: trpc_1.publicProcedure.query(async () => {
    const books = await prisma.book.findMany();
    return { books };
  }),

  upload: trpc_1.publicProcedure.mutation(async ({ ctx }) => {
    return new Promise((resolve, reject) => {
      upload.fields([
        { name: "image", maxCount: 1 },
        { name: "pdf", maxCount: 1 },
      ])(ctx.req, ctx.res, (err) => {
        if (err) {
          reject(err);
        } else {
          const files = ctx.req.files;

          console.log(files);

          if (!files) {
            reject({ error: "No files were found!" });
          } else {
            uploadFile(files)
              .then((result) => {
                console.log(result);
                resolve(result);
              })
              .catch((error) => {
                reject(error);
              });
          }
        }
      });
    });
  }),

  aboutBookById: trpc_1.publicProcedure
    .input(zod_1.z.string())
    .query(async ({ input }) => {
      console.log("Input");
      console.log(input);

      const book = await prisma.book.findUnique({
        where: { id: parseInt(input) },
      });
      return { book };
    }),

  rateBook: trpc_1.publicProcedure
    .input(
      zod_1.z.object({
        BookId: zod_1.z.string(),
        rating: zod_1.z.number(),
      })
    )
    .mutation(async (req) => {
      const { BookId, rating } = req.input;
      const bookIdInt = parseInt(BookId);
      console.log(bookIdInt);
      console.log(rating);

      const newRating = await prisma.rating.create({
        data: {
          BookId: bookIdInt,
          rating: rating,
        },
      });

      return { message: "Rating submitted successfully!" };
    }),

  rateBookById: trpc_1.publicProcedure
    .input(zod_1.z.string())
    .query(async ({ input }) => {
      try {
        const bookId = parseInt(input);
        const ratings = await prisma.rating.findMany({
          where: { BookId: bookId },
        });

        if (ratings.length > 0) {
          return { ratings };
        } else {
          throw new Error("Ratings not found");
        }
      } catch (error) {
        console.error("Failed to get ratings:", error);
        throw new Error("Failed to get ratings");
      }
    }),
});
exports.default = ExampleRouter;
