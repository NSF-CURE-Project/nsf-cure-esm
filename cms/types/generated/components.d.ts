import type { Schema, Struct } from '@strapi/strapi';

export interface LessonProblemSet extends Struct.ComponentSchema {
  collectionName: 'components_lesson_problem_sets';
  info: {
    description: 'Defines problem sets for lessons.';
    displayName: 'Problem Set';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    questions: Schema.Attribute.Component<'lesson.question', true>;
  };
}

export interface LessonQuestion extends Struct.ComponentSchema {
  collectionName: 'components_lesson_questions';
  info: {
    description: 'Defines individual questions within a problem set.';
    displayName: 'Question';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    questionText: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'lesson.problem-set': LessonProblemSet;
      'lesson.question': LessonQuestion;
    }
  }
}
