/*
  Warnings:

  - You are about to drop the column `quizId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `quizId` on the `Response` table. All the data in the column will be lost.
  - Added the required column `quiz_id` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quiz_id` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_quizId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "quizId",
ADD COLUMN     "quiz_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "quizId",
ADD COLUMN     "quiz_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
