import express from 'express';
import { issues } from './data.mjs';
import { filterByLabel, filterByMinimumScore, paginate, sortByPriority } from './domain.mjs';

export const app = express();

// Empty/whitespace strings must stay rejected; Number('') is 0, not NaN.
function parseMinScore(rawValue) {
  const trimmed = typeof rawValue === 'string' ? rawValue.trim() : '';
  return trimmed === '' ? NaN : Number(trimmed);
}

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/issues', (request, response) => {
  const { label, minScore, page = '1', perPage = '10' } = request.query;
  const labelFilteredIssues = label ? filterByLabel(issues, label) : [...issues];

  let filteredIssues = labelFilteredIssues;
  if (minScore !== undefined) {
    const parsedMinScore = parseMinScore(minScore);
    if (!Number.isFinite(parsedMinScore) || parsedMinScore < 0) {
      response.status(400).json({ error: 'minScore must be a finite number greater than or equal to 0' });
      return;
    }
    filteredIssues = filterByMinimumScore(labelFilteredIssues, parsedMinScore);
  }

  const prioritizedIssues = sortByPriority(filteredIssues);

  response.json({
    issues: paginate(prioritizedIssues, page, perPage),
    page: Math.max(1, Math.trunc(Number(page) || 1)),
    perPage: Math.max(1, Math.trunc(Number(perPage) || 10)),
    total: prioritizedIssues.length
  });
});

app.get('/api/issues/:id', (request, response) => {
  const issue = issues.find((item) => item.id === Number(request.params.id));

  if (!issue) {
    response.status(404).json({ error: 'Issue not found' });
    return;
  }

  response.json(issue);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Mona's Issue Triage API listening on port ${port}`);
  });
}
