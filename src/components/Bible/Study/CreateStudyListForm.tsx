"use client";

import {
  InteractiveForm,
  SubmitButton,
  SubmitMessage,
  FormErrorMessage,
} from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  InputControl,
} from "@/components/CoreAdvancedComponent/components/form";
import { ReserveLayout } from "@/components/ui/reverse-layout";
import { Input } from "@/components/ui/input";
import { createStudyList } from "@/app/actions/bible/study";
import {
  STUDY_LIST_DESCRIPTION_FIELDS,
  STUDY_LIST_GENERAL_FIELDS,
  STUDY_LIST_TITLE_FIELDS,
  type StudyListFields,
} from "./constants";
import { Button } from "@/components/ui/button";
import { LoadingMessage } from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
export function CreateStudyListForm() {
  return (
    <Form asChild className="contents">
      <InteractiveForm<StudyListFields>
        className="space-y-4 rounded-2xl border border-border bg-card/80 p-6 shadow-sm"
        fields={[STUDY_LIST_TITLE_FIELDS, STUDY_LIST_DESCRIPTION_FIELDS, STUDY_LIST_GENERAL_FIELDS]}
        action={createStudyList}
      >
        <FormErrorMessage name="general" match="unauthorized">
          Session expired. Please sign in again.
        </FormErrorMessage>
        <FormErrorMessage name="general" match="save_failed">
          Failed to create study list. Please try again.
        </FormErrorMessage>
        <FormField name={STUDY_LIST_TITLE_FIELDS}>
          <FormLabel>Name*</FormLabel>
          <InputControl asChild>
            <Input
              required
              minLength={3}
              maxLength={80}
              placeholder="e.g. Morning Devotion"
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            />
          </InputControl>
          <ReserveLayout placeItems="start">
            <FormMessage match="valueMissing">Name is required.</FormMessage>
            <FormMessage match="tooShort">
              Name must be at least 3 characters long.
            </FormMessage>
            <FormMessage match="tooLong">
              Name must be at most 80 characters long.
            </FormMessage>
          </ReserveLayout>
        </FormField>
        <FormField name={STUDY_LIST_DESCRIPTION_FIELDS}>
          <FormLabel>Description</FormLabel>
          <InputControl asChild>
            <Input
              maxLength={200}
              placeholder="What is this study about?"
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            />
          </InputControl>
          <ReserveLayout placeItems="start">
            <FormMessage match="tooLong">
              Description must be at most 200 characters long.
            </FormMessage>
          </ReserveLayout>
        </FormField>
        <SubmitButton asChild>
          <Button type="submit" className="w-full">
            <LoadingMessage>Creating study list...</LoadingMessage>
            <SubmitMessage>Create List</SubmitMessage>
          </Button>
        </SubmitButton>
      </InteractiveForm>
    </Form>
  );
}
