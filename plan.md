```markdown
# Detailed Implementation Plan for Revised Upholstery Quotation App

This plan outlines the changes needed to update the existing mobile quotation app so that:
• Materials are used solely for cost calculations (no product inventory).
• Users can add new unit-of-measure types while these are saved for future product entries.
• All monetary values use Lempiras as the currency.
• A history of generated quotations is stored and can be shared as PDF (from either new quotations or the history).

---

## 1. Modify Material Data Handling

### A. Update Inventory Context
**File:** src/context/InventoryContext.tsx  
- **Changes:**
  - Remove the `quantity` field from the `Material` interface so that products only store: 
    - `id`, `name`, `unitCost`, and `unit`.
  - Update all functions (addMaterial, updateMaterial, etc.) to ignore quantity.
- **Error Handling:**
  - Wrap localStorage read/write in try/catch blocks.
- **Best Practices:**
  - Use TypeScript interfaces and ensure backward compatibility with existing localStorage data (migrate or ignore previous quantity fields).

### B. Update Inventory Page Form
**File:** src/app/inventory/page.tsx  
- **Changes:**
  - Remove the input field for quantity.
  - In the form, keep inputs for `name` and `unitCost`.
  - For “Unidad de Medida”, replace the static select with one populated from a new context (see Units Context below) and add an option to add a new unit.
  - Update any table or card view to no longer show “Stock” but only show the unit cost.
- **UI/UX:**
  - The form remains modern and mobile-friendly using clear typography and spacing.

---

## 2. Introduce Unit-of-Measure Management

### A. Create Units Context
**File:** src/context/UnitsContext.tsx  
- **Features:**
  - Store an array of unit strings (e.g., `"metros"`, `"unidades"`, `"kg"`, `"litros"`, `"m2"`).
  - Provide functions to add a new unit and retrieve the list.
  - Persist the list in localStorage.
- **Changes:**
  - Initialize with default units.
  - Expose `units` list and an `addUnit(newUnit: string)` function.
- **Error Handling:**
  - Validate non-empty inputs and handle localStorage failures.

### B. Update Inventory Page to Use Units Context
**File:** src/app/inventory/page.tsx  
- **Changes:**
  - Import and use `UnitsContext` to populate the unit dropdown.
  - Provide an inline option (or modal) labeled “Agregar Nueva Unidad” allowing the user to enter a new unit.
  - On submission, call `addUnit(newUnit)` to update the global list.
- **UI/UX:**
  - The dropdown should have a streamlined look with clear spacing; new unit addition should be simple and integrated into the form.

---

## 3. Update Currency Display

### A. Currency Change to Lempiras
**Files to update:**  
- src/app/page.tsx  
- src/app/inventory/page.tsx  
- src/app/quote/page.tsx  
- Any other UI that displays monetary values

- **Changes:**
  - Replace currency symbol "$" with "L" or "Lempiras" (e.g., format numbers as `L${amount.toLocaleString(…)}`).
  - Ensure all calculations and displayed totals now use the new currency symbol.
- **UI/UX:**
  - Use a consistent currency format across the app.

---

## 4. Implement Quote History & PDF Sharing

### A. Create Quotes Context
**File:** src/context/QuotesContext.tsx  
- **Features:**
  - Define a `Quote` interface:  
    ```typescript
    interface Quote {
      id: string;
      clientName: string;
      projectDescription: string;
      laborCost: number;
      items: Array<{ productName: string; unitCost: number; unit: string; quantity: number }>;
      totalCost: number;
      createdAt: string;
    }
    ```
  - Provide functions to add a new quote and retrieve the history.
  - Persist quotes in localStorage.
- **Error Handling:**
  - Wrap localStorage operations in try/catch.
  
### B. Update Quote Page (New Quote Generation)
**File:** src/app/quote/page.tsx  
- **Changes:**
  - Remove any reliance on inventory “quantity.” Instead, allow the user to input the desired quantity for each selected product within the quote.
  - After generating the quote summary, call the QuotesContext function to save the quote.
  - Update currency symbols to Lempiras.
- **UI/UX:**
  - Maintain clear separation between entering quote data and quote summary.
  
### C. Create Quote History Page
**File:** src/app/quote/history/page.tsx  
- **Features:**
  - List all saved quotes from the QuotesContext.
  - For each quote, display a card with: client name, date, total cost, and a short list of product summaries.
  - Include a “Compartir PDF” button on each card.
- **UI/UX:**
  - Use modern cards with ample spacing, clear typography, and a responsive layout.
  
### D. Implement PDF Generation / Sharing
- **Method:**
  - Add a utility function (e.g., in src/lib/utils.ts) called `generatePDF(quote: Quote)` that uses a client-side PDF library (such as jsPDF) or leverages window.print() with a print-friendly layout.
  - Bind this function to the “Compartir PDF” buttons on both the new quote screen and in the quote history.
- **Error Handling:**
  - Validate that quote data is complete before generating a PDF.
- **UI/UX:**
  - Provide a visual feedback (e.g., toast notification) once the PDF is generated or downloaded.

---

## 5. Update Global Layout Navigation

### A. Add Navigation Link for Quote History
**File:** src/app/layout.tsx  
- **Changes:**
  - In the header navigation, add a new link to “Historial Cotizaciones” linking to `/quote/history`.
- **UI/UX:**
  - Maintain consistent styling with other navigation links.

---

## 6. Testing & Error Handling

- **Test Each Change:**
  - Verify that the inventory form now does not include quantity.
  - Ensure new unit measurements are saved and reused.
  - Test all currency displays show Lempiras.
  - Test quote calculation: User must manually input quantity in the quote page.
  - Validate quote history: New quotes are stored and displayed, and PDF generation works.
- **Error Handling:**
  - Confirm validations on form inputs.
  - Check localStorage operations for both products, units, and quotes.
  - Use try/catch to properly handle JSON parsing errors.

---

## Summary

• InventoryContext is updated to remove product “quantity” while products hold only name, unitCost, and unit.  
• A new UnitsContext is created to manage and persist user-defined measurement units.  
• Currency displays across the app are updated from "$" to "L" representing Lempiras.  
• A new QuotesContext stores the history of generated quotes, and a new Quote History page (src/app/quote/history/page.tsx) provides a UI to view and share quotes as a PDF using a PDF generation utility.  
• Global navigation is updated to include a link to the Quote History.  
• All changes include robust error handling and maintain a modern, mobile-friendly UI using existing styling patterns.
