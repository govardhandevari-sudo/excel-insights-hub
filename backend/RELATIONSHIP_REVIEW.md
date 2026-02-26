# Table & Relationship Review (Reporting Scope)

## Core location hierarchy
- `state_master.id` -> `city_master.stateID`
- `city_master.ID` -> `centre_master.CityID`
- `state_master.id` -> `centre_master.StateID`

## Payment Mode report data path
- `f_reciept.PaymentModeID` -> `payment_mode.PaymentModeId`
- `f_reciept.LedgerTransactionID` -> `f_ledgertransaction.LedgerTransactionID`
- `f_ledgertransaction.CentreID` -> `centre_master.CentreID`

## Department Revenue report data path
- `patient_labinvestigation_opd.LedgerTransactionID` -> `f_ledgertransaction.LedgerTransactionID`
- `patient_labinvestigation_opd.SubCategoryID` -> `f_subcategorymaster.SubCategoryID`
- `f_ledgertransaction.CentreID` -> `centre_master.CentreID`

## Salesperson Targets page
- Salesperson master source: `employee_master.Employee_ID`
- ID-based location mapping introduced:
  - `salesperson_centre_map.salesperson_id` -> `employee_master.Employee_ID`
  - `salesperson_centre_map.centre_id` -> `centre_master.CentreID`
- Historical targets table:
  - `salesperson_target_history.salesperson_id` stores salesperson identifier used by UI/API.

## Why this fix was required
- Joining `employee_master` to centres via text (`e.City = c.Centre`) is not reliable.
- All report filters are driven by numeric IDs (state/city/centre), so salesperson filtering should also be ID-based.
