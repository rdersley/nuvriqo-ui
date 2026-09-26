# UI Kit (`@forge/react`) equivalents

UI Kit apps get Atlassian tokens and dark mode automatically. Consistency with the Custom UI apps comes from using the same patterns, not the same CSS. Current UI Kit apps are Smart Approval, DHL Delivery Manager and Attachment Renamer.

| Style-guide pattern | UI Kit |
|---|---|
| `nq-header` | `<Stack space="space.050">` containing `<Text size="small" weight="bold" color="color.text.subtlest">NUVRIQO</Text>`, `<Heading size="large">Product</Heading>`, `<Text color="color.text.subtle">subtitle</Text>`; version as `<Lozenge>` in an `<Inline spread="space-between">` |
| `nq-tabs` | `<Tabs><TabList><Tab>…` + `<TabPanel>` |
| `nq-card` | `<Box xcss={card}>` with `card = xcss({ backgroundColor: 'elevation.surface.raised', boxShadow: 'elevation.shadow.raised', borderRadius: 'border.radius.200', padding: 'space.200' })` |
| `nq-notice--*` | `<SectionMessage appearance="success|warning|error|information|discovery" title="…">` |
| `nq-lozenge--*` | `<Lozenge appearance="success|removed|moved|inprogress|new|default">` (danger→`removed`, warning→`moved`, info→`inprogress`, discovery→`new`) |
| `nq-btn--primary / subtle / danger` | `<Button appearance="primary|subtle|danger">` |
| `nq-loading` | `<Inline space="space.100" alignBlock="center"><Spinner size="medium" /><Text>Loading projects…</Text></Inline>` |
| `nq-empty` | `<EmptyState header="No rules yet" description="…" primaryAction={<Button appearance="primary">Create rule</Button>} />` |
| `nq-table` | `<DynamicTable>` |
| `nq-field` | `<Form>` + `<FormSection>` + `<Label>` + `<Textfield>` / `<Select>` + `<HelperMessage>` / `<ErrorMessage>` |
| `nq-stats` | `<Inline space="space.100">` of cards, each with `<Heading size="medium">` + `<Text size="small" color="color.text.subtlest">` |
| `nq-footer` | `<Text size="small" color="color.text.subtlest" align="center">Nuvriqo Product · v1.4.0</Text>` |

## Rules

- Never pass a hex colour to `xcss` or props. Use token names (`color.text.subtle`, `elevation.surface.raised`).
- Don't hand-roll collapsible sections from buttons and ▼/▶ glyphs. Use `<Tabs>`, or `<Expand>` where it's available.
- Use `<SectionMessage>` for feedback only, not for log rows or plain layout.
- Pin versions (`@forge/react`, `@forge/bridge`) instead of `"latest"`, so all apps render the same.
