/**
 * @file budget-summary.tsx
 * @description
 *   This client component displays the budget overview metrics such as:
 *   - Gross Income
 *   - VAT @ 21%
 *   - IRPF Rate & Monthly Income Tax
 *   - Professional & Personal Expenses
 *   - Net Income
 *   - 6-Month Projected Savings
 *   - 6-Month Savings Goal
 *   - Difference (projected vs. goal)
 *
 * Implementation:
 *   - Receives these values as props from the server page.
 *   - Renders them in a simple card format using Shadcn UI <Card>.
 *
 * @notes
 *   - Must be "use client" to handle any client-side interactions (if needed).
 *   - Currently, it's just for display.
 *   - Future enhancements might include charts or other data visualizations.
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BudgetSummaryProps {
  grossIncome: number
  vat: number
  irpfRate: number
  incomeTax: number
  totalProfessional: number
  totalPersonal: number
  netIncome: number
  projectedSavings: number
  savingsGoal: number
  difference: number
}

/**
 * @function BudgetSummary
 * Renders budget metrics in a stylized card.
 *
 * @param props.grossIncome       Monthly gross income
 * @param props.vat               Monthly VAT at 21% of gross
 * @param props.irpfRate          IRPF bracket rate (0.19, 0.24, etc.)
 * @param props.incomeTax         Calculated monthly IRPF amount
 * @param props.totalProfessional Sum of professional expenses
 * @param props.totalPersonal     Sum of personal expenses
 * @param props.netIncome         Net monthly income
 * @param props.projectedSavings  6-month projected savings (netIncome * 6)
 * @param props.savingsGoal       6-month savings goal (from user setting)
 * @param props.difference        projectedSavings - savingsGoal
 *
 * @returns A React component that displays a read-only budget summary
 */
export default function BudgetSummary(props: BudgetSummaryProps) {
  return (
    <Card className="max-w-lg border">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Gross Income */}
        <div className="flex items-center justify-between">
          <span>Gross Income:</span>
          <span className="font-semibold">€{props.grossIncome.toFixed(2)}</span>
        </div>

        {/* VAT */}
        <div className="flex items-center justify-between">
          <span>VAT (21%):</span>
          <span className="font-semibold">€{props.vat.toFixed(2)}</span>
        </div>

        {/* IRPF Rate */}
        <div className="flex items-center justify-between">
          <span>IRPF Rate:</span>
          <span className="font-semibold">
            {(props.irpfRate * 100).toFixed(2)}%
          </span>
        </div>

        {/* Monthly Income Tax */}
        <div className="flex items-center justify-between">
          <span>Monthly Income Tax:</span>
          <span className="font-semibold">€{props.incomeTax.toFixed(2)}</span>
        </div>

        {/* Professional Expenses */}
        <div className="flex items-center justify-between">
          <span>Professional Expenses:</span>
          <span className="font-semibold">
            €{props.totalProfessional.toFixed(2)}
          </span>
        </div>

        {/* Personal Expenses */}
        <div className="flex items-center justify-between">
          <span>Personal Expenses:</span>
          <span className="font-semibold">
            €{props.totalPersonal.toFixed(2)}
          </span>
        </div>

        {/* Net Income */}
        <hr className="my-2" />
        <div className="flex items-center justify-between font-bold">
          <span>Net Income:</span>
          <span>€{props.netIncome.toFixed(2)}</span>
        </div>

        {/* 6-Month Projection */}
        <hr className="my-2" />
        <div className="flex items-center justify-between">
          <span>6-Month Projected Savings:</span>
          <span className="font-semibold">
            €{props.projectedSavings.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>6-Month Savings Goal:</span>
          <span className="font-semibold">€{props.savingsGoal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Difference:</span>
          <span
            className={`font-semibold ${
              props.difference < 0 ? "text-red-500" : "text-green-600"
            }`}
          >
            €{props.difference.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
