-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Employer', 'Applicant');

-- CreateEnum
CREATE TYPE "message_status" AS ENUM ('UNDELIEVERED', 'DELIEVERED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "delete_at" TIMESTAMP(3),
    "name" TEXT,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_profile" (
    "user_id" TEXT NOT NULL,
    "primary_role" TEXT NOT NULL,
    "years_of_experience" INTEGER NOT NULL,
    "education" TEXT,
    "skills" TEXT[],

    CONSTRAINT "applicant_profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "employer_profile" (
    "user_id" TEXT NOT NULL,

    CONSTRAINT "employer_profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "employer_id" TEXT NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicant_profile_on_jobs" (
    "applicant_profile_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applicant_profile_on_jobs_pkey" PRIMARY KEY ("applicant_profile_id","job_id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "content" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "status" "message_status" NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applicant_profile_user_id_key" ON "applicant_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "employer_profile_user_id_key" ON "employer_profile"("user_id");

-- AddForeignKey
ALTER TABLE "applicant_profile" ADD CONSTRAINT "applicant_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employer_profile" ADD CONSTRAINT "employer_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_employer_id_fkey" FOREIGN KEY ("employer_id") REFERENCES "employer_profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_profile_on_jobs" ADD CONSTRAINT "applicant_profile_on_jobs_applicant_profile_id_fkey" FOREIGN KEY ("applicant_profile_id") REFERENCES "applicant_profile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicant_profile_on_jobs" ADD CONSTRAINT "applicant_profile_on_jobs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
