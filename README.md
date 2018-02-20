# Jedi_Temple
A CMS for managing unahil, kampamocha &amp; tucha stores

## API Rules

- ALL routes should receive a valid authentication token in headers.
  > `headers: { 'Authorization': 'Bearer thisisthetoken982hr9232ex...' } `
- There should be only one route per task (All, Create, Read, Remove, Update).
- Documents update logic should be handled in the controller, not in the client.
- The controller should accept fields to modify (Either the full document or specific fields).
- If the field to modify is an array the controller will treat the received value as the final state of 
  that array (Except for ObjectIds in embeded objects).
- For fields that result of combining other (components) fields (two or more); If any of the components 
  field is modified, middleware should be handled the necessary fields to also update the result field.
  > E.g. Slug field composed of name and store fields.
- If there are any secondary effects they should be handled in middleware, not the controller, neither the client.
- Protected Fields should be validated in middleware in order to prevent accidental modification.
- The controller should return the updated document.
