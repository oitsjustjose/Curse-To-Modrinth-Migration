/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react';
import {
  Form, Button, Container, Accordion, Image,
} from 'react-bootstrap';
import { TbInfoHexagon } from 'react-icons/tb';
import OutputLog from '../components/OutputLog';
import Info from '../components/Help/Info';
import HeaderImg from '../img/ctm.png';

export default () => {
  const [dark, setDark] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [modals, setModals] = useState({ info: false, delim: false });
  const [jobId, setJobId] = useState(window.localStorage.getItem('last-jobid'));
  const [formData, setFormData] = useState({
    githubPat: '',
    curseforgeSlug: '',
    modrinthId: '',
  });

  useEffect(() => { // DARK MODE STUFF HERE
    // Set initial state before even bothering with the update state
    window.document.scrollingElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light');

    const pref = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (query) => {
      window.document.scrollingElement.setAttribute(
        'data-bs-theme',
        query.matches ? 'dark' : 'light',
      );
      setDark(query.matches);
    };

    pref.addEventListener('change', onChange);
    return () => pref.removeEventListener('change', onChange);
  }, [dark, setDark]);

  const makeJob = async (evt) => {
    evt.preventDefault();
    if (!formData.githubPat.length) return;
    if (!formData.curseforgeSlug.length) return;
    if (!formData.modrinthId.length) return;

    const resp = await fetch('/api/v1/jobs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (resp && resp.ok) {
      const data = await resp.text();
      setJobId(data);
      window.localStorage.setItem('last-jobid', data);
    }
  };

  return (
    <div className="ctm-root">
      <Info override={modals.info} propagateOnHide={() => setModals({ ...modals, info: false })} />

      <Container style={{ margin: '1rem auto', maxWidth: '512px' }}>
        <Image className="d-block mb-3 mx-auto w-50 headerimg" src={HeaderImg} />
        <p className="text-center" style={{ fontSize: '1.25rem' }}>
          <b>C</b>
          urse
          {' '}
          <b>T</b>
          o
          {' '}
          <b>M</b>
          odrinth
          {' '}
          <b>M</b>
          od
          {' '}
          <b>M</b>
          igrator
        </p>
        <Form onSubmit={makeJob} className="juse-form">
          <Form.Group className="mb-3" controlId="githubPat">
            <Form.Label>GitHub Personal Access Token</Form.Label>
            <Form.Control
              type="password"
              required
              placeholder="This field is required"
              value={formData.githubPat}
              onChange={(x) => setFormData({
                ...formData,
                githubPat: x.target.value,
              })}
            />
            <Form.Text className="text-muted">
              This value is encrypted from end-to-end and even in storage
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>CurseForge Project Slug</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="This field is required"
              value={formData.curseforgeSlug}
              onChange={(x) => setFormData({
                ...formData,
                curseforgeSlug: x.target.value,
              })}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="projId">
            <Form.Label>Modrinth Project ID</Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="This field is required"
              value={formData.modrinthId}
              onChange={(x) => setFormData({
                ...formData,
                modrinthId: x.target.value,
              })}
            />
          </Form.Group>

          <Button variant={dark ? 'light' : 'dark'} type="submit">Submit</Button>
          <Button
            className="info"
            onClick={() => setModals({ ...modals, info: true })}
            variant={dark ? 'light' : 'dark'}
            type="button"
          >
            <TbInfoHexagon />
          </Button>
        </Form>

        {jobId && (
        <Accordion defaultActiveKey="0" className="mt-2">
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <div>
                Status &amp; Output Log for Job
                {' '}
                <code>{`#${jobId}`}</code>
              </div>
            </Accordion.Header>
            <Accordion.Body>{jobId && (<OutputLog id={jobId} />)}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
        )}
      </Container>

      {/* <Button

        className="info"
        variant="light"
      /> */}
    </div>
  );
};
