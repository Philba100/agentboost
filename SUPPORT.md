# Support & Community

Need help with AgentBoost? Here's how to get support.

## 📧 Direct Contact

**Email**: [phillipmbanda@gmail.com](mailto:phillipmbanda@gmail.com)  
**Response Time**: 24-48 hours for general inquiries

### For Different Issues

| Issue Type | Contact Method | Priority |
|-----------|-----------|----------|
| Bug reports | GitHub Issues | High |
| Feature requests | GitHub Discussions | Medium |
| General questions | Email or Discussions | Medium |
| Security issues | Email (private) | Critical |
| Enterprise support | Email with SLA details | High |

---

## 🐛 Reporting Bugs

Please report bugs through [GitHub Issues](https://github.com/phillipmbanda/agentboost/issues) with:

1. **Clear title** — Brief description of the bug
2. **Steps to reproduce** — How to trigger the issue
3. **Expected behavior** — What should happen
4. **Actual behavior** — What actually happens
5. **Screenshots/logs** — If applicable
6. **Environment** — OS, browser, Node version

**Example issue:**
```
Title: "Dashboard fails to load on mobile Safari"

Description:
- Steps: Open dashboard on iPad Safari, scroll down
- Expected: Page scrolls smoothly
- Actual: Page freezes, black area appears
- Browser: Safari 17.4 on iPad OS 17.5
- Error: [Paste console error here]
```

---

## 💬 GitHub Discussions

For questions and discussions:
- [GitHub Discussions](https://github.com/phillipmbanda/agentboost/discussions)
- Ask questions about features
- Share tips and tricks
- Discuss use cases

---

## 📚 Documentation

Check the extensive documentation first:

- **[README.md](./README.md)** — Overview, installation, quick start
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — Development guidelines
- **[Skill Documentation](./skills/)** — Individual skill guides
- **[docs/](./docs/)** — Detailed guides (if available)

---

## 🆘 Common Issues

### Issue: Build fails with TypeScript errors

**Solution:**
```bash
# Clear Node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Issue: Supabase connection fails

**Check:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct in `.env.local`
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
3. Check network connectivity
4. Verify Supabase project is active

```bash
# Test connection
curl https://your-project.supabase.co/auth/v1/health
```

### Issue: Stripe payment fails

**Check:**
1. `STRIPE_SECRET_KEY` is set in environment
2. Webhook endpoint is configured in Stripe dashboard
3. Test mode vs. live mode keys are consistent
4. Customer email matches Supabase user email

### Issue: Skills not loading

**Check:**
1. SKILL.md files exist in `skills/{skillId}/`
2. Skill ID matches in `skillsData.ts`
3. No missing dependencies in package.json
4. Build was successful: `npm run build`

**Debug:**
```bash
# Check if skill markdown file exists
ls skills/lead-qualifier/SKILL.md

# Check skillsData.ts includes the skill
grep "lead-qualifier" app/lib/skillsData.ts

# Check API endpoint
curl http://localhost:3000/api/skill-md?id=lead-qualifier
```

### Issue: Authentication not working

**Check:**
1. Supabase auth configuration is correct
2. User email can receive confirmation emails
3. Database `profiles` table exists
4. Session storage is enabled in browser

**Debug:**
```bash
# Check Supabase auth status
npx supabase status

# View logs
npx supabase logs

# Test auth endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Issue: Slow performance / High memory usage

**Solutions:**
1. Clear browser cache: `Ctrl+Shift+Delete`
2. Disable browser extensions
3. Check for memory leaks: Open DevTools → Memory tab
4. Restart development server: `Ctrl+C` then `npm run dev`
5. Check for excessive console errors

---

## 💰 Sponsorship & Support Plans

For production deployments, we offer support:

### Free Support
- GitHub Issues
- Documentation
- Community discussions
- Email (best effort)

### Professional Support ($50/month)
- Email support (24-48 hour response)
- Priority bug fixes
- Early access to features
- Monthly updates call

### Enterprise Support (Custom)
- SLA-backed support (4 hour response)
- Dedicated account manager
- Custom integrations
- On-site training
- Security audits

**[Become a Sponsor](https://github.com/sponsors/phillipmbanda)**

---

## 📞 Response Times

- **Critical bugs**: 4-8 hours
- **Minor bugs**: 24-48 hours  
- **Feature requests**: 1 week
- **General questions**: 2-3 days

*Response times may vary based on sponsorship level.*

---

## 🔒 Security Issues

For security vulnerabilities:

1. **DO NOT** create a public issue
2. **Email**: phillipmbanda@gmail.com
3. **Subject**: "SECURITY: [Brief Description]"
4. **Include**: Steps to reproduce, impact assessment, suggested fix

We take security seriously and will:
- Acknowledge receipt within 24 hours
- Provide timeline for fix
- Credit you in release notes (if desired)
- Keep issue confidential until patched

---

## 📲 Stay Updated

- **GitHub Star** — Stay in the loop
- **Watch releases** — Get notified of updates
- **GitHub Discussions** — Latest news and announcements
- **Email list** — Subscribe for updates (coming soon)

---

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [React Hooks](https://react.dev/reference/react)

---

## 🤝 Community

- [GitHub Discussions](https://github.com/phillipmbanda/agentboost/discussions)
- [GitHub Issues](https://github.com/phillipmbanda/agentboost/issues)
- Follow author: [@phillipmbanda](https://github.com/phillipmbanda)

---

## 📝 FAQ

**Q: Is AgentBoost free to use?**  
A: Yes! It's released under MIT License. Professional support and sponsorship are optional but appreciated.

**Q: Can I use AgentBoost in production?**  
A: Yes, but we recommend sponsoring the project for production deployments to ensure continued support.

**Q: How do I add my own skills?**  
A: See [Development Guide](./docs/development.md) or the README section "Adding a New Skill".

**Q: What's included in Enterprise tier?**  
A: All 31+ skills, unlimited API calls, priority support, and custom integrations.

**Q: Can I modify the source code?**  
A: Yes! MIT License allows modifications. Just follow the contribution guidelines.

**Q: How often are updates released?**  
A: Monthly updates with new features, bug fixes, and security patches.

**Q: Is there a roadmap?**  
A: Check [GitHub Discussions](https://github.com/phillipmbanda/agentboost/discussions) for planned features.

---

**Have another question?** [Contact us](mailto:phillipmbanda@gmail.com)
