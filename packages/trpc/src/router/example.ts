import { z } from "zod";
import { router, publicProcedure } from "../trpc";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import uploadFile from "../aws";
import upload from "../middleware/multer";

const ExampleRouter = router({
  exampleWithArgs: publicProcedure
    .input(
      z.object({
        message: z.string(),
      })
    )
    .mutation((req) => {
      return { info: req.input.message };
    }),

  example: publicProcedure.query(async ({ ctx }) => {
    return { info: 42 };
  }),

  registerBook: publicProcedure
    .input(
      z.object({
        name: z.string(),
        author: z.string(),
        readTime: z.string(),
        details: z.string(),
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

      return { book: createdBook };
    }),

  getBooks: publicProcedure.query(async () => {
    const books = await prisma.book.findMany();
    return { books };
  }),

  upload: publicProcedure.mutation(async ({ ctx }) => {
    return new Promise((resolve, reject) => {
      upload.fields([
        { name: "image", maxCount: 1 },
        { name: "pdf", maxCount: 1 },
      ])(ctx.req, ctx.res, (err) => {
        if (err) {
          reject(err);
        } else {
          const files = ctx.req.files;
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
  aboutBookById: publicProcedure.input(z.string()).query(async ({ input }) => {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(input) },
    });
    return { book };
  }),

  rateBook: publicProcedure
    .input(
      z.object({
        BookId: z.string(),
        rating: z.number(),
      })
    )
    .mutation(async (req) => {
      const { BookId, rating } = req.input;
      const bookIdInt = parseInt(BookId);

      const newRating = await prisma.rating.create({
        data: {
          BookId: bookIdInt,
          rating: rating,
        },
      });

      return { message: "Rating submitted successfully!" };
    }),

  rateBookById: publicProcedure.input(z.string()).query(async ({ input }) => {
    const bookId = parseInt(input);

    try {
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

export default ExampleRouter;
