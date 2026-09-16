#!/usr/bin/env python3
"""Utility for syncing AgentBoost skill metadata into Supabase for semantic routing.

This script walks the local skills directory, reads each SKILL.md file, and upserts
its metadata into the `skill_embeddings` table. That table is designed to support
vector search and dynamic desktop/web routing for multi-agent execution.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

try:
    from supabase import create_client
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Missing dependency: install python-supabase (pip install supabase)"
    ) from exc

try:
    from openai import OpenAI
except ImportError as exc:
    raise SystemExit(
        "Missing dependency: install openai (pip install openai)"
    ) from exc

ROOT = Path(__file__).resolve().parent
SKILLS_DIR = ROOT / 'skills'


def get_embedding(text: str, client: OpenAI) -> list[float]:
    """Generate embedding for the given text using OpenAI."""
    text = text.replace("\n", " ")
    return client.embeddings.create(input=[text], model="text-embedding-3-small").data[0].embedding


def load_skills_metadata(openai_client: OpenAI) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []

    for skill_dir in sorted(SKILLS_DIR.iterdir()):
        if not skill_dir.is_dir():
            continue

        skill_file = skill_dir / 'SKILL.md'
        if not skill_file.exists():
            continue

        content = skill_file.read_text(encoding='utf-8')
        description = (content.splitlines()[0].strip('# ').strip() if content else '')

        print(f"Generating embedding for: {skill_dir.name}")
        embedding = get_embedding(content or description or skill_dir.name, openai_client)

        rows.append(
            {
                'skill_id': skill_dir.name,
                'slug': skill_dir.name,
                'name': skill_dir.name.replace('-', ' ').title(),
                'category': 'enterprise',
                'description': description,
                'markdown_path': str(skill_file.relative_to(ROOT)),
                'content': content,
                'embedding': embedding,
            }
        )

    return rows


def sync_to_supabase() -> None:
    supabase_url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    service_role_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    openai_key = os.environ.get('OPENAI_API_KEY')

    if not supabase_url or not service_role_key:
        raise SystemExit(
            'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.'
        )

    if not openai_key:
        raise SystemExit('Set OPENAI_API_KEY before running this script.')

    supabase_client = create_client(supabase_url, service_role_key)
    openai_client = OpenAI(api_key=openai_key)

    rows = load_skills_metadata(openai_client)

    response = supabase_client.table('skill_embeddings').upsert(
        rows,
        on_conflict='skill_id',
    ).execute()

    if response.get('error'):
        raise SystemExit(f"Supabase sync failed: {response['error']}")

    print(json.dumps({'synced_rows': len(rows)}, indent=2))


if __name__ == '__main__':
    sync_to_supabase()