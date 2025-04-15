Self attacks:
  Tony attacking self:
    Date: 4/15/2025
    Classification: Path Traversal
    Severity: 9
    Description: Can navigate to the create franchise or create store pages without being logged in by using the correct URL.  However, without an authtoken, the requests to create a store or franchise get denied.
    Images: <img width="1451" alt="Screenshot 2025-04-15 at 12 57 15 PM" src="https://github.com/user-attachments/assets/a72cfdc1-3d37-4278-b357-5c3f49c7b224" />
  <img width="1451" alt="Screenshot 2025-04-15 at 12 57 28 PM" src="https://github.com/user-attachments/assets/9bc52eb8-7b3c-42b8-b75f-85a649282069" />
    Fix: Check for the correct level of authorization on those pages
  
Peer attacks:
  Tony attacking Benson:
    Date: 4/15/2025
    Classification: Injection
    Severity: 7
    Description: Can update columns outside of the intended columns in the updateUser function.  However, as SQL prevents primary key (User ID) from being updated, this is not very severe.
    This is the SQL query as it arrived to the database: UPDATE user SET password='$2b$10$neun8e/8gE1nANuVyWPfp.wQ36YDSVtA9NdbUb8dT/Cw/SKmfKYB2', email='hacker@jwt.com', id = '1' WHERE id=5911
    Image: <img width="1453" alt="Screenshot 2025-04-15 at 1 22 17 PM" src="https://github.com/user-attachments/assets/1a6f9dfa-c493-4241-80c6-ac92bce07686" />
    Fix: Sanitize user inputs
