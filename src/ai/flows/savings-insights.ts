'use server';

/**
 * @fileOverview Provides personalized savings insights based on user's financial history and savings goals.
 *
 * - getSavingsInsights - A function that returns the savings insights.
 * - SavingsInsightsInput - The input type for the getSavingsInsights function.
 * - SavingsInsightsOutput - The return type for the getSavingsInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SavingsInsightsInputSchema = z.object({
  income: z
    .number()
    .describe('The user monthly income in USD. Must be a positive number.'),
  expenses: z
    .record(z.string(), z.number())
    .describe(
      'A key-value pair object that represents the user expenses. Each key is the expense category and value is the amount in USD. Must be a positive number.'
    ),
  targetSavingsRate: z
    .number()
    .describe(
      'The target savings rate the user wants to achieve. Must be a number between 0 and 1.'
    ),
});
export type SavingsInsightsInput = z.infer<typeof SavingsInsightsInputSchema>;

const SavingsInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe('An array of savings insights.'),
});
export type SavingsInsightsOutput = z.infer<typeof SavingsInsightsOutputSchema>;

export async function getSavingsInsights(
  input: SavingsInsightsInput
): Promise<SavingsInsightsOutput> {
  return savingsInsightsFlow(input);
}

const savingsInsightsPrompt = ai.definePrompt({
  name: 'savingsInsightsPrompt',
  input: {schema: SavingsInsightsInputSchema},
  output: {schema: SavingsInsightsOutputSchema},
  prompt: `You are a personal finance advisor. Provide personalized and actionable suggestions for improving savings rate based on the user's financial history and target savings goal.

User's monthly income: ${'{{income}}'} USD
User's expenses:
${'{{#each expenses}}'}  ${'{{@key}}'}: ${'{{this}}'} USD
${'{{/each}}'}

User's target savings rate: ${'{{targetSavingsRate}}'}

Provide a list of insights that can help the user achieve their target savings rate.
`,
});

const savingsInsightsFlow = ai.defineFlow(
  {
    name: 'savingsInsightsFlow',
    inputSchema: SavingsInsightsInputSchema,
    outputSchema: SavingsInsightsOutputSchema,
  },
  async input => {
    const {output} = await savingsInsightsPrompt(input);
    return output!;
  }
);
