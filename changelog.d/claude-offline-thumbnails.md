### Added

- Your region's plant photos can now come with you offline. [Settings](https://indigene.app/#/settings/offline) shows how many and roughly how big, then keeps them on your phone, one a second, each still credited to its photographer.
- Internal: thumbnails are kept in `indigene-v1-saved-photos`, read first by the worker and never trimmed. One fetch a second from the open-data bucket, zero API calls, five CC licences only; a 429/403/5xx or three failures in a row holds for a day (`lib/offline-photos.ts` quotes iNaturalist's guidance).
